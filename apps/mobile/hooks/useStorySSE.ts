import { useEffect, useRef, useCallback } from 'react';
import { AppState } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import useAuthStore from '@/store/auth/authStore';
import { STORY_ENDPOINTS } from '@/api/stories/storyEndpoints';

interface StoryEvent {
  type: 'story_completed' | 'connected';
  storyId?: string;
  title?: string;
  chaptersCount?: number;
}

/**
 * Hook that connects to SSE endpoint for real-time story events.
 * Replaces polling — invalidates query cache when a story completes.
 */
export function useStorySSE() {
  const token = useAuthStore(state => state.token);
  const queryClient = useQueryClient();
  const abortControllerRef = useRef<AbortController | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isConnectedRef = useRef(false);

  const connect = useCallback(() => {
    if (!token || isConnectedRef.current) return;

    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    isConnectedRef.current = true;

    const processStream = async () => {
      try {
        const response = await fetch(STORY_ENDPOINTS.STORY_EVENTS, {
          headers: { 'Authorization': token },
          signal: abortController.signal,
        });

        if (!response.ok || !response.body) {
          throw new Error(`SSE connection failed: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const event: StoryEvent = JSON.parse(line.slice(6));
                if (event.type === 'story_completed') {
                  queryClient.invalidateQueries({ queryKey: ['library', 'stories'] });
                }
              } catch {
                // Ignore parse errors (keepalive, malformed)
              }
            }
          }
        }
      } catch (error: any) {
        if (error.name === 'AbortError') return;
        console.warn('[SSE] Connection error:', error.message);
      } finally {
        isConnectedRef.current = false;
      }

      // Reconnect after 5s if not manually disconnected
      if (!abortController.signal.aborted) {
        reconnectTimeoutRef.current = setTimeout(connect, 5000);
      }
    };

    processStream();
  }, [token, queryClient]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    isConnectedRef.current = false;
  }, []);

  useEffect(() => {
    if (!token) return;

    connect();

    // Handle app state changes — reconnect when coming to foreground
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        if (!isConnectedRef.current) {
          connect();
        }
      } else {
        disconnect();
      }
    });

    return () => {
      disconnect();
      subscription.remove();
    };
  }, [token, connect, disconnect]);
}
