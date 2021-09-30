const assert = require('assert')
const BinaryHeapMap = require('.')

/* eslint-env mocha */

describe('binary-heap', () => {
  beforeEach(() => {
    this.hm = new BinaryHeapMap()

    this.hm.insert(3)
    this.hm.insert(12)
    this.hm.insert(1)
    this.hm.insert(5)
    this.hm.insert(7)
    this.hm.insert(4)
    this.hm.insert(9)
    this.hm.insert(12)
  })

  describe('#constructor()', () => {
    it('throws if comparator isn\'t a function', () => {
      try {
        const heap = new BinaryHeapMap([])
        assert.fail('Should throw')
        console.log(heap)
      } catch ({ message }) {
        assert.strictEqual(message, 'Expected comparator to be a function')
      }
    })

    it('throws if identifier isn\'t a function', () => {
      try {
        const heap = new BinaryHeapMap(() => {}, true)
        assert.fail('Should throw')
        console.log(heap)
      } catch ({ message }) {
        assert.strictEqual(message, 'Expected identifier to be a function')
      }
    })
  })

  describe('#insert()', () => {
    it('inserts lowest value', () => {
      assert.strictEqual(this.hm.size, 8)
      assert.strictEqual(this.hm.get(0), 1)

      this.hm.insert(0)

      assert.strictEqual(this.hm.size, 9)
      assert.strictEqual(this.hm.get(0), 0)
    })
  })

  describe('#extract()', () => {
    it('extracts highest priority value', () => {
      assert.strictEqual(this.hm.extract(), 1)
    })

    it('extracts entire heap', () => {
      const results = Array
        .from({ length: this.hm.size })
        .map(() => this.hm.extract())

      assert.deepStrictEqual(results, [
        1,
        3,
        4,
        5,
        7,
        9,
        12,
        12
      ])
    })

    it('extracts from empty heap', () => {
      const result = Array
        .from({ length: this.hm.size + 1 })
        .map(() => this.hm.extract())
        .pop()

      assert.strictEqual(result, null)
    })
  })

  describe('#indexOf()', () => {
    it('returns -1 if element not found', () => {
      assert.strictEqual(this.hm.indexOf(100), -1)
    })

    it('returns index of lowest element', () => {
      assert.strictEqual(this.hm.indexOf(1), 0)
    })

    it('returns indices of other elements', () => {
      assert.notStrictEqual(this.hm.indexOf(3), -1)
      assert.notStrictEqual(this.hm.indexOf(4), -1)
      assert.notStrictEqual(this.hm.indexOf(5), -1)
      assert.notStrictEqual(this.hm.indexOf(7), -1)
      assert.notStrictEqual(this.hm.indexOf(9), -1)
      assert.notStrictEqual(this.hm.indexOf(12), -1)
    })
  })

  describe('#insertThenExtract()', () => {
    it('just returns smallest value', () => {
      assert.strictEqual(this.hm.insertThenExtract(0), 0)
      assert.strictEqual(this.hm.indexOf(0), -1)
    })

    it('inserts value then returns root', () => {
      assert.strictEqual(this.hm.insertThenExtract(8), 1)
      assert.notStrictEqual(this.hm.indexOf(8), -1)
    })
  })

  describe('#delete()', () => {
    it('tries to delete element that doesn\'t exist', () => {
      assert.strictEqual(this.hm.delete(10), false)
    })

    it('deletes element from heap', () => {
      assert.strictEqual(this.hm.delete(9), true)
      assert.strictEqual(this.hm.indexOf(9), -1)
    })

    it('deletes duplicate elements from heap', () => {
      assert.strictEqual(this.hm.delete(12), true)
      assert.notStrictEqual(this.hm.indexOf(12), -1)

      assert.strictEqual(this.hm.delete(12), true)
      assert.strictEqual(this.hm.indexOf(12), -1)
    })

    it('deletes last element from heap', () => {
      this.hm.insert(14)

      assert.strictEqual(this.hm.delete(14), true)
      assert.strictEqual(this.hm.indexOf(14), -1)
    })
  })

  describe('#edit()', () => {
    it('tries to edit element that doesn\'t exist', () => {
      assert.strictEqual(this.hm.edit(10, 7), false)

      const results = Array
        .from({ length: this.hm.size })
        .map(() => this.hm.extract())

      assert.deepStrictEqual(results, [
        1,
        3,
        4,
        5,
        7,
        9,
        12,
        12
      ])
    })

    it('decreases element in heap', () => {
      assert.strictEqual(this.hm.edit(9, 6), true)

      const results = Array
        .from({ length: this.hm.size })
        .map(() => this.hm.extract())

      assert.deepStrictEqual(results, [
        1,
        3,
        4,
        5,
        6,
        7,
        12,
        12
      ])
    })

    it('increases element in heap', () => {
      assert.strictEqual(this.hm.edit(9, 14), true)

      const results = Array
        .from({ length: this.hm.size })
        .map(() => this.hm.extract())

      assert.deepStrictEqual(results, [
        1,
        3,
        4,
        5,
        7,
        12,
        12,
        14
      ])
    })

    it('increases root', () => {
      assert.strictEqual(this.hm.edit(1, 10), true)

      const results = Array
        .from({ length: this.hm.size })
        .map(() => this.hm.extract())

      assert.deepStrictEqual(results, [
        3,
        4,
        5,
        7,
        9,
        10,
        12,
        12
      ])
    })

    it('decreases element to become new root', () => {
      assert.strictEqual(this.hm.edit(9, 0), true)

      const results = Array
        .from({ length: this.hm.size })
        .map(() => this.hm.extract())

      assert.deepStrictEqual(results, [
        0,
        1,
        3,
        4,
        5,
        7,
        12,
        12
      ])
    })

    it('does nothing if value\'s same', () => {
      assert.strictEqual(this.hm.edit(12, 12), true)

      const results = Array
        .from({ length: this.hm.size })
        .map(() => this.hm.extract())

      assert.deepStrictEqual(results, [
        1,
        3,
        4,
        5,
        7,
        9,
        12,
        12
      ])
    })
  })
})
