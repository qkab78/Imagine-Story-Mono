import { test } from "@japa/runner";
import { IRandomService } from "../services/IRandomService.js";
import { StoryId } from "./story-id.vo.js";

class TestRandomService implements IRandomService {
    public generateRandomUuid(): string {
        return '1234567890-1234-5678-9012-345678901234'
    }
}

test.group(StoryId.name, () => {
    test('should create a story id', async ({ assert }) => {
        const storyId = new StoryId(new TestRandomService())    
        assert.isDefined(storyId)
        assert.equal(storyId.getValue(), '1234567890-1234-5678-9012-345678901234')
    })
    test('should equals two story ids', async ({ assert }) => {
        const storyId1 = new StoryId(new TestRandomService())
        const storyId2 = new StoryId(new TestRandomService())
        assert.isTrue(storyId1.equals(storyId2))
    })
})