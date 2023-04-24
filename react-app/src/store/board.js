// TODO: CONSTANTS
const USER_BOARDS = 'USER_BOARDS';
const SINGLE_BOARD = 'SINGLE_BOARD';
const CREATE_BOARD = 'CREATE_BOARD';
const DELETE_BOARD = 'DELETE_BOARD';
const ADD_PIN_TO_BOARD = 'ADD_PIN_TO_BOARD';



// TODO: ACTION CREATORS
export const actionUserBoards = (boards) => {
  return { type: USER_BOARDS, boards }
}

export const actionSingleBoard = (board) => {
  return { type: SINGLE_BOARD, board}
}

export const actionCreateBoard = (board) => {
  return { type: CREATE_BOARD, board }
}

export const actionAddPinToBoard = (board) => {
  return { type: ADD_PIN_TO_BOARD, board}
}

export const actionDeleteBoard = (boardId) => {
  return { type: DELETE_BOARD, boardId }
}

// TODO: NORMALIZE DATA
const normalizeBoards = (data) => {
  let normalized = {};
  data?.forEach(board => {
    normalized[board.id] = board;
  })
  return normalized;
}

// TODO: THUNK AC'S
export const thunkUserBoards = (userId) => async dispatch => {
  const response = await fetch(`/api/boards/userBoards/${userId}`);

  if (response.ok) {
    const data = await response.json();
    const normalized = normalizeBoards(data.boards);
    dispatch(actionUserBoards(normalized));
    return;
  }
}

export const thunkSingleBoard = (boardId) => async dispatch => {
  const response = await fetch(`/api/boards/singleBoard/${boardId}`);

  if (response.ok) {
    const data = await response.json();
    dispatch(actionSingleBoard(data.board))
    return;
  }
}

export const thunkCreateBoard = (board, userId) => async dispatch => {
  const response = await fetch(`/api/boards/newBoard`, {
    method:'POST',
    body: board
  })

  if (response.ok) {
    return dispatch(thunkUserBoards(userId))
  }
}

export const thunkAddPinToBoard = (boardId, pinId) => async dispatch => {
  const response = await fetch(`/api/boards/addPin/${boardId}/${pinId}`, {
    method:'PUT'
  })

  if (response.ok) {
    const data = await response.json();
    console.log('UPDATED BOARD', data)
  }
}

export const thunkDeleteBoard = (boardId) => async dispatch => {
  const response = await fetch(`/api/boards/deleteBoard/${boardId}`, {
    method:'DELETE'
  })

  if (response.ok) {
    dispatch(actionDeleteBoard(boardId))
    return;
  }
}


// TODO: INITIAL SLICE STATE
const initialState = {
  userBoards: {},
  singleBoard: {}
}


// TODO: REDUCER
const boardsReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_BOARDS:
      return { ...state, userBoards: { ...action.boards } }
    case SINGLE_BOARD:
      return { ...state, singleBoard: { ...action.board }}
    case DELETE_BOARD:
      let newState = { ...state, userBoards: { ...state.userBoards }}
      delete newState.userBoards[action.boardId]
      return newState
    default: return { ...state }
  }
}

export default boardsReducer;
