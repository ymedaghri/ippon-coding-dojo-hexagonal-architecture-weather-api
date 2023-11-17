import { describe, expect, test } from 'vitest'
import { getArticles } from '.'


describe("Test Suite 1", () => {
    test("Test 1", () => {
        // Given
        const articles = getArticles()

        // When
        const firstArticle = articles[0]

        // Then
        expect(firstArticle.description).toBe("skateboard")
    })
    test("Test 2", () => {
        // Given
        const articles = getArticles()

        // When
        const firstArticle = articles[0]

        // Then
        expect(firstArticle.size).toBe("6in")
    })
})