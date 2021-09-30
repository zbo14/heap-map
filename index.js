const defaultComparator = (a, b) => {
  if (a > b) return 1
  if (a < b) return -1

  return 0
}

const defaultIdentifier = x => x

class BinaryHeapMap {
  constructor (comparator = defaultComparator, identifier = defaultIdentifier) {
    if (typeof comparator !== 'function') {
      throw new Error('Expected comparator to be a function')
    }

    if (typeof identifier !== 'function') {
      throw new Error('Expected identifier to be a function')
    }

    this.comparator = comparator
    this.identifier = identifier

    this.elements = []
    this.indexes = new Map()
  }

  get lastIndex () {
    return this.size - 1
  }

  get size () {
    return this.elements.length
  }

  get (index) {
    return this.elements[index]
  }

  indexOf (element) {
    const key = this.identifier(element)

    return this.indexes.get(key)?.[0] ?? -1
  }

  insert (element) {
    const index = this.elements.push(element) - 1
    const key = this.identifier(element)
    const indexes = (this.indexes.get(key) || []).concat(index)

    this.indexes.set(key, indexes)

    index && this.heapifyUp(index, key)
  }

  extract () {
    const { size } = this

    if (size === 0) return null

    if (size === 1) return this.elements.pop()

    const root = this.elements[0]
    this.elements[0] = this.elements.pop()

    this.heapifyDown(0)

    return root
  }

  insertThenExtract (element) {
    const root = this.elements[0]
    const cmp = this.comparator(element, root)

    if (cmp === -1) return element

    const rootKey = this.identifier(root)
    const key = this.identifier(element)

    this.elements[0] = element

    const rootIndexes = this.indexes
      .get(rootKey)
      .filter(Boolean)

    this.updateIndexes(rootKey, rootIndexes)

    const indexes = (this.indexes.get(key) || []).concat(0)

    this.indexes.set(key, indexes)
    this.heapifyDown(0)

    return root
  }

  edit (oldElement, newElement) {
    const oldKey = this.identifier(oldElement)
    const indexes = this.indexes.get(oldKey)

    if (!indexes) return false

    const [index] = indexes
    const newKey = this.identifier(newElement)

    this.elements[index] = newElement

    if (newKey !== oldKey) {
      this.indexes.delete(oldKey)
      this.indexes.set(newKey, indexes)
    }

    const cmp = this.comparator(oldElement, newElement)

    if (cmp === 1) {
      this.heapifyUp(index, newKey)
    } else if (cmp === -1) {
      this.heapifyDown(index, newKey)
    }

    return true
  }

  delete (element) {
    const key = this.identifier(element)
    const indexes = this.indexes.get(key)

    if (!indexes) return false

    const [index] = indexes
    const { lastIndex } = this
    const otherElement = this.elements[lastIndex]
    const otherKey = this.identifier(otherElement)

    index === lastIndex || this.swap(
      element,
      otherElement,
      index,
      lastIndex,
      key,
      otherKey
    )

    this.elements.pop()

    {
      const indexes = this.indexes
        .get(key)
        .filter(index => index !== lastIndex)

      this.updateIndexes(key, indexes)
    }

    if (index === lastIndex) return true

    const cmp = this.comparator(element, otherElement)

    if (cmp === 1) {
      this.heapifyUp(index, otherKey)
    } else if (cmp === -1) {
      this.heapifyDown(index, otherKey)
    }

    return true
  }

  updateIndexes (key, indexes) {
    indexes.length
      ? this.indexes.set(key, indexes)
      : this.indexes.delete(key)
  }

  swap (
    element1,
    element2,
    index1,
    index2,
    key1 = this.identifier(element1),
    key2 = this.identifier(element2)
  ) {
    this.elements[index1] = element2
    this.elements[index2] = element1

    const indexes1 = this.indexes
      .get(key1)
      .map(index => index === index1 ? index2 : index)

    const indexes2 = this.indexes
      .get(key2)
      .map(index => index === index2 ? index1 : index)

    this.indexes.set(key1, indexes1)
    this.indexes.set(key2, indexes2)
  }

  heapifyUp (index, key) {
    const element = this.elements[index]

    while (index) {
      const parentIndex = (index - 1) / 2 | 0
      const parent = this.elements[parentIndex]
      const cmp = this.comparator(element, parent)

      if (cmp === 0 || cmp === 1) return

      this.swap(
        element,
        parent,
        index,
        parentIndex,
        key
      )

      index = parentIndex
    }
  }

  heapifyDown (index, key) {
    const lastIndex = (this.size - 1) / 2 | 0

    while (index < lastIndex) {
      const element = this.elements[index]

      const child1Index = index * 2 + 1
      const child2Index = index * 2 + 2

      const child1 = this.elements[child1Index]
      const child2 = this.elements[child2Index]

      const done = (
        this.comparator(element, child1) === -1 &&
        this.comparator(element, child2) === -1
      )

      if (done) return

      const cmp = this.comparator(child1, child2)

      if (cmp === -1) {
        this.swap(
          element,
          child1,
          index,
          child1Index,
          key
        )

        index = child1Index
      } else {
        this.swap(
          element,
          child2,
          index,
          child2Index,
          key
        )

        index = child2Index
      }
    }

    const swapElements = (
      this.size === 2 &&
      this.comparator(...this.elements) === 1
    )

    swapElements && this.swap(
      this.elements[0],
      this.elements[1],
      0,
      1
    )
  }
}

module.exports = BinaryHeapMap
