
import { combineEpics, ofType } from 'redux-observable'
import { map } from 'rxjs/operators'
import { modalActionTypes, modalActionCreators } from '../'
const {
  MODAL_CONFIRM,
} = modalActionTypes

const confirmationEpic = action$ => action$.pipe(
  ofType(MODAL_CONFIRM),
  map(action => ({...action.payload.modalAction}))
)

const modalEpic = combineEpics(
  confirmationEpic
)

export { modalEpic }
