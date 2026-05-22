/**
 * Common path test module.
 *
 * Check that a common path can be found for paths.
 */
import * as assert from "assert";
import {
  _allElementsEqual,
  _splitStrings,
  commonPath,
  mostCommonParent,
} from "../../lib/commonPath";

describe("Split an array of strings at a separator", function () {
  describe("#_splitStrings", function () {
    it("should split 3 strings correctly with the default separator", function () {
      const items = ["a/b/c", "ABC/DEF/GHI", "1/2/3"];

      const expected = [
        ["a", "b", "c"],
        ["ABC", "DEF", "GHI"],
        ["1", "2", "3"],
      ];

      assert.deepStrictEqual(_splitStrings(items), expected);
    });
  });
});

describe("Check if all elements in an array are equal", function () {
  describe("#_allElementsEqual", function () {
    it("should return true for array with all equal elements", function () {
      assert.strictEqual(_allElementsEqual([1, 1, 1]), true);
      assert.strictEqual(_allElementsEqual(["a", "a", "a"]), true);
      assert.strictEqual(_allElementsEqual([true, true, true]), true);
    });

    it("should return false for array with different elements", function () {
      assert.strictEqual(_allElementsEqual([1, 2, 1]), false);
      assert.strictEqual(_allElementsEqual(["a", "b", "a"]), false);
      assert.strictEqual(_allElementsEqual([true, false, true]), false);
    });

    it("should handle empty array", function () {
      assert.strictEqual(_allElementsEqual([]), true);
    });

    it("should handle array with single element", function () {
      assert.strictEqual(_allElementsEqual([1]), true);
      assert.strictEqual(_allElementsEqual(["a"]), true);
    });
  });
});

describe("Find the highest common parent directory for paths", function () {
  // This is useful when building a change message about multiple files and
  // seeing what the high common level is between them so this can be used in
  // the message. If the parent directory is needed for that to keep it much
  // shorter, that is easy from the std lib.
  describe("#commonPath", function () {
    it("should give the common path for 3 root repo paths", function () {
      const paths = ["foo", "bar", "fizz/buzz"];

      assert.strictEqual(commonPath(paths), "repo root");
    });

    // These are relative to the repo root but don't have a forward slash,
    // based on git output from status or diff-index.
    it("should give the common path for 2 different paths", function () {
      const paths = ["Foo/test", "Foo/bar/test"];

      assert.strictEqual(commonPath(paths), "Foo");
    });

    it("should give the common path for 3 similar repo paths", function () {
      const paths = [
        "fizz/buzz/coverage/test",
        "fizz/buzz/covert/operator",
        "fizz/buzz/tmp/coven/members",
      ];

      assert.strictEqual(commonPath(paths), "fizz/buzz");
    });

    // This shouldn't matter for use in a repo but just check its robustness.
    it("should give the common path for 3 related absolute paths", function () {
      const paths = [
        "/home/user1/tmp/coverage/test",
        "/home/user1/tmp/covert/operator",
        "/home/user1/tmp/coven/members",
      ];

      assert.strictEqual(commonPath(paths), "/home/user1/tmp");
    });
  });
});

describe("Find the most common parent directory for paths", function () {
  describe("#mostCommonParent", function () {
    it("returns the deepest path when all share the same parent", function () {
      const paths = [
        "src/fizz/buzz/foo.md",
        "src/fizz/bazz/bar.md",
      ];
      assert.strictEqual(mostCommonParent(paths), "src/fizz");
    });

    it("returns the path with the highest count", function () {
      const paths = [
        "src/fizz/buzz/foo.md",
        "src/fizz/bazz/bar.md",
        "src/fizz/bazz/baz.md",
        "src/todo.md",
      ];

      assert.strictEqual(mostCommonParent(paths), "src");
    });

    it("returns undefined when files are all at the repo root", function () {
      const paths = ["foo.txt", "bar.txt"];

      assert.strictEqual(mostCommonParent(paths), undefined);
    });

    it("prefers higher count, then deeper on tie", function () {
      const paths = [
        "a/b/c/d/foo",
        "a/b/c/d/bar",
        "a/b/baz",
        "a/b/fizz",
      ];

      assert.strictEqual(mostCommonParent(paths), "a/b");
    });

    it("handles a single file by returning undefined", function () {
      const paths = ["foo/bar.txt"];

      assert.strictEqual(mostCommonParent(paths), undefined);
    });

    it("returns the top-level directory when files share only that", function () {
      const paths = ["src/foo.txt", "src/bar.txt", "lib/baz.txt"];

      assert.strictEqual(mostCommonParent(paths), "src");
    });
  });
});
