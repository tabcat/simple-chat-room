
const getNavListState = (state) => state.navigation.navList

const getChainEnd = (list, id, key) => !!list[id] && !!list[id][key]
  ? getChainEnd(list, list[id][key], key)
  : id
const firstChild =
  (list, itemId) => getChainEnd(list, list[itemId].children[0], 'prevId')
const listOrder = (list, start = 'root', key = 'nextId', order = []) =>
  !!list[start][key]
  	? listOrder(list, list[start][key], key, [ ...order, start ])
  	: [...order, start]

const navListSelectors = {
  getNavListState,
  getFirstChild: (list, parentId) =>
    getChainEnd(list, list[parentId].children[0], 'prevId'),
  getLastChild: (list, parentId) =>
    getChainEnd(list, list[parentId].children[0], 'nextId'),
  getChildOrder: (list, parentId) =>
    listOrder(list, firstChild(list, parentId)),
  getHeirOrder: (list, itemId) =>
    listOrder(list, itemId, 'parent')
    .map((heir, index, heirs) => heirs[heirs.length - 1 - index])
}

export { navListSelectors }

// function removeZero(arr) {
//   return arr.filter((item, index) => index !== 0)
// }
//
// const itemByLocation = (obj, locationKeys) => {
//   if (locationKeys.length === 0) {
//     return obj
//   }
//   return itemByLocation(obj[locationKeys[0]], removeZero(locationKeys))
// }
//
// const updateNestedImmutable = (obj, locationKeys, value) => {
//   return locationKeys.length === 1
//   ? {
//     [locationKeys[0]]: value
//   }
//   : {
//     ...obj,
//     [locationKeys[0]]: updateNestedImmutable(obj[locationKeys[0]], removeZero(locationKeys), value)
//   }
// }
//
// const deleteNestedImmutable = (obj, locationKeys) => {
//   if (locationKeys.length === 1) {
//     const { [locationKeys[0]]: deleted, ...newObj } = obj
//     return newObj
//   } else {
//     return {
//       ...obj,
//       [locationKeys[0]]: deleteNestedImmutable(obj[locationKeys[0]], removeZero(locationKeys))
//     }
//   }
// }
//
// const childByLocation = (obj, locationKeys) => {
//   if (locationKeys.length === 1) {
//     return obj[locationKeys[0]]
//   }
//   return childByLocation(obj[locationKeys[0]].children, removeZero(locationKeys))
// }
// const listItemByKeys = (state, locationKeys) => childByLocation(getNavDrawerState(state).list, locationKeys)
