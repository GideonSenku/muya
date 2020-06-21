import LinkedNode from '@/block/base/linkedList/linkedNode'
import LinkedList from '@/block/base/linkedList/linkedList'
import { createDomNode } from '@/utils/dom'
import { BLOCK_DOM_PROPERTY } from '@/config'

class TreeNode extends LinkedNode {
  get static () {
    return this.constructor
  }

  get scrollPage () {
    return this.muya.editor.scrollPage
  }

  get isScrollPage () {
    return this.static.blockName === 'scrollpage'
  }

  get isContainerBlock () {
    return this.children instanceof LinkedList
  }

  constructor (muya) {
    super()
    this.muya = muya
    this.parent = null
    this.domNode = null
    this.tagName = null
    this.classList = []
    this.attributes = {}
    this.datasets = {}
  }

  /**
   * create domNode
   */
  createDomNode () {
    const { tagName, classList, attributes, datasets } = this

    const domNode = createDomNode(tagName, {
      classList,
      attributes,
      datasets
    })

    domNode[BLOCK_DOM_PROPERTY] = this

    this.domNode = domNode

    return domNode
  }

  previousContentInContext () {
    if (this.isScrollPage) {
      return null
    }

    const { parent } = this
    if (parent.prev) {
      return parent.prev.lastContentInDescendant()
    } else {
      return parent.previousContentInContext()
    }
  }

  nextContentInContext () {
    if (this.isScrollPage) {
      return null
    }

    const { parent } = this
    if (parent.next) {
      return parent.next.firstContentInDescendant()
    } else {
      return parent.nextContentInContext()
    }
  }

  /**
   * Weather `this` is the only child of its parent.
   */
  isOnlyChild () {
    return this.isFirstChild() && this.isLastChild()
  }

  /**
   * Weather `this` is the first child of its parent.
   */
  isFirstChild () {
    return this.prev === null
  }

  /**
   * Weather `this` is the last child of its parent.
   */
  isLastChild () {
    return this.next === null
  }

  /**
   * Remove the current block in the block tree.
   */
  remove () {
    if (!this.parent) return
    this.parent.children.remove(this)
    this.parent = null
    this.domNode.remove()

    return this
  }
}

export default TreeNode