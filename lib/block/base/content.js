import TreeNode from '@/block/base/treeNode'
import { EVENT_KEYS } from '@/config'
// import logger from '@/utils/logger'

// const debug = logger('block.content:')

class Content extends TreeNode {
  static blockName = 'content'

  get hasFocus () {
    return document.activeElement === this.domNode
  }

  get jsonState () {
    return this.muya.editor.jsonState
  }

  get selection () {
    return this.muya.editor.selection
  }

  get inlineRenderer () {
    return this.muya.editor.inlineRenderer
  }

  get path () {
    const { path: pPath } = this.parent

    return [...pPath, 'text']
  }

  constructor (muya, text) {
    super(muya)
    this.tagName = 'span'
    this.classList = ['mu-content']
    this.attributes = {
      contenteditable: true
    }
    this.text = text
    this.isComposed = false
    this.eventIds = []
  }

  createDomNode () {
    super.createDomNode()
    this.listenDOMEvents()
    this.update()
  }

  update () {
    const { text } = this
    this.domNode.innerHTML = `<span class="mu-syntax-text">${text}</span>`
  }

  listenDOMEvents () {
    const { eventCenter } = this.muya
    const { domNode } = this

    const eventIds = [
      eventCenter.attachDOMEvent(domNode, 'input', this.inputHandler.bind(this)),
      eventCenter.attachDOMEvent(domNode, 'keydown', this.keydownHandler.bind(this)),
      eventCenter.attachDOMEvent(domNode, 'keyup', this.keyupHandler.bind(this)),
      eventCenter.attachDOMEvent(domNode, 'click', this.clickHandler.bind(this)),
      eventCenter.attachDOMEvent(domNode, 'blur', this.blurHandler.bind(this)),
      eventCenter.attachDOMEvent(domNode, 'focus', this.focusHandler.bind(this)),
      eventCenter.attachDOMEvent(domNode, 'compositionend', this.composeHandler.bind(this)),
      eventCenter.attachDOMEvent(domNode, 'compositionstart', this.composeHandler.bind(this))
    ]
    this.eventIds.push(...eventIds)
  }

  composeHandler = (event) => {
    if (event.type === 'compositionstart') {
      this.isComposed = true
    } else if (event.type === 'compositionend') {
      this.isComposed = false
      // Because the compose event will not cause `input` event, So need call `inputHandler` by ourself
      this.inputHandler(event)
    }
  }

  detachDOMEvents () {
    for (const id of this.eventIds) {
      this.muya.eventCenter.detachDOMEvent(id)
    }
  }

  // Do nothing, because this method will implemented in sub class.
  inputHandler () {}

  keydownHandler = (event) => {
    switch (event.key) {
      case EVENT_KEYS.Backspace:
        this.backspaceHandler(event)
        break

      case EVENT_KEYS.Delete:
        this.deleteHandler(event)
        break

      case EVENT_KEYS.Enter:
        if (!this.isComposed) {
          this.enterHandler(event)
        }
        break

      case EVENT_KEYS.ArrowUp: // fallthrough

      case EVENT_KEYS.ArrowDown: // fallthrough

      case EVENT_KEYS.ArrowLeft: // fallthrough

      case EVENT_KEYS.ArrowRight: // fallthrough
        if (!this.isComposed) {
          this.arrowHandler(event)
        }
        break

      case EVENT_KEYS.Tab:
        this.tabHandler(event)
        break
      default:
        break
    }
  }

  keyupHandler () {}
  clickHandler () {}

  blurHandler () {
    let block = this.parent
    while (block && block.isContainerBlock) {
      block.active = false
      block = block.parent
    }
  }

  focusHandler () {
    let block = this.parent
    while (block && block.isContainerBlock) {
      block.active = true
      block = block.parent
    }
  }

  remove () {
    this.detachDOMEvents()
    super.remove()
    this.domNode.remove()
    this.domNode = null
  }
}

export default Content