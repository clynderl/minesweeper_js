import {createBoard, markTile, revealTile, TILE_STATUS, checkWin, checkLose} from "./minesweeper.js";

const BOARD_SIZE = 10
const NUMBER_OF_MINES = 10

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES)
const boardElement = document.querySelector('.board')
const minesLeft = document.querySelector('[data-mine-count]')
const messageText = document.querySelector('.subtext')


console.log(board)
board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element)
        tile.element.addEventListener('contextmenu', e => {
            e.preventDefault()
            markTile(tile)
            listMinesLeft()
        })
        tile.element.addEventListener('click', () => {
            revealTile(board, tile)
            checkGameEnd()
        })
    })
})

function listMinesLeft() {
    const markedTilesCount = board.reduce((count, row) => {
        return count + row.filter(tile => tile.status === TILE_STATUS.MARKED).length
    }, 0)
    minesLeft.textContent = NUMBER_OF_MINES - markedTilesCount
}

function checkGameEnd() {
    const win = checkWin(board)
    const lose = checkLose(board)
    if (win || lose) {
        boardElement.addEventListener('click', stopProp, {capture: true})
        boardElement.addEventListener('contextmenu', stopProp, {capture: true})
    }
    if (win) {
        messageText.textContent = 'You Win!'
    }
    if (lose) {
        messageText.textContent = 'You Lost!'
        board.forEach(row => {
            row.forEach(tile => {
                if (tile.status === TILE_STATUS.MARKED) markTile(tile)
                if (tile.mine) revealTile(board, tile)
            })
        })
    }
}

function stopProp(e) {
    e.stopImmediatePropagation()
}

boardElement.style.setProperty('--size', BOARD_SIZE)
minesLeft.textContent = NUMBER_OF_MINES
// console.log(createBoard(2, 2))
