import Parent from '@/block/base/parent'
import ScrollPage from '@/block/scrollPage'

class OrderList extends Parent {
  static blockName = 'order-list'

  static create (muya, state) {
    const orderList = new OrderList(muya, state)

    orderList.append(...state.children.map(child => ScrollPage.loadBlock(child.name).create(muya, child)))

    return orderList
  }

  get path () {
    const { path: pPath } = this.parent
    const offset = this.parent.offset(this)

    return [...pPath, offset, 'children']
  }

  constructor (muya, { meta }) {
    super(muya)
    this.tagName = 'ol'
    this.meta = meta
    this.classList = ['mu-order-list']
    this.createDomNode()
  }

  getState () {
    const state = {
      name: this.static.blockName,
      children: this.children.map(child => child.getState())
    }

    return state
  }
}

export default OrderList