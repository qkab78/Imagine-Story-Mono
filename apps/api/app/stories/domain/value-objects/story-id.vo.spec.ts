import { test } from "@japa/runner";
import { IRandomService } from "../services/IRandomService.js";
import { StoryId } from "./story-id.vo.js";

class TestRandomService implements IRandomService {
    public generateRandomUuid(): string {
        return '1720955b-4474-4a1d-bf99-3907a000ba65'
    }
}

test.group(StoryId.name, () => {
    test('should create a story id', async ({ assert }) => {
        const storyId = new StoryId(new TestRandomService())    
        assert.isDefined(storyId)
        assert.equal(storyId.getValue(), '1720955b-4474-4a1d-bf99-3907a000ba65')
    })
    test('should equals two story ids', async ({ assert }) => {
        const storyId1 = new StoryId(new TestRandomService())
        const storyId2 = new StoryId(new TestRandomService())
        assert.isTrue(storyId1.equals(storyId2))
    })
})