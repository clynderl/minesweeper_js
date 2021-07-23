export const TILE_STATUS = {
    HIDDEN: 'hidden',
    MINE: 'mine',
    NUMBER: 'number',
    MARKED: 'marked',
}

export function createBoard(boardSize, numberOfMines) {
    const board = []
    const minePositions = getMinePositions(boardSize, numberOfMines)
    console.log(minePositions)
    for (let i = 0; i < boardSize; i++) {
        const row = []
        for (let j = 0; j < boardSize; j++) {
            const element = document.createElement('div')
            element.dataset.status = TILE_STATUS.HIDDEN
            const tile = {
                i,
                j,
                element,
                mine: minePositions.some(positionMatch.bind(null, {i, j})),
                get status() {
                    return this.element.dataset.status
                },
                set status(value) {
                    this.element.dataset.status = value
                }
            }
            row.push(tile)
        }
        board.push(row)
    }
    return board
}

export function markTile(tile) {
    if (tile.status !== TILE_STATUS.HIDDEN && tile.status !== TILE_STATUS.MARKED)
        return
    if (tile.status === TILE_STATUS.MARKED) {
        tile.status = TILE_STATUS.HIDDEN
    } else {
        tile.status = TILE_STATUS.MARKED
    }
}

export function revealTile(board, tile) {
    if (tile.status !== TILE_STATUS.HIDDEN) {
        return
    }
    if (tile.mine) {
        tile.status = TILE_STATUS.MINE
        return
    }
    tile.status = TILE_STATUS.NUMBER
    const adjacentTiles = nearbyTiles(board, tile)
    const mines = adjacentTiles.filter(tile => tile.mine)
    if (mines.length === 0) {
        adjacentTiles.forEach(revealTile.bind(null, board))
    } else {
        tile.element.textContent = mines.length
    }
}

export function checkWin(board) {
    return board.every(row => {
        return row.every(tile => {
            return tile.status === TILE_STATUS.NUMBER ||
                (tile.mine &&
                    (tile.status === TILE_STATUS.HIDDEN ||
                        tile.status === TILE_STATUS.MARKED))
        })
    })
}

export function checkLose(board) {
    return board.some(row => {
        return row.some(tile => {
            return tile.status === TILE_STATUS.MINE
        })
    })
}

function getMinePositions(boardSize, numberOfMines) {
    const positions = []
    while (positions.length < numberOfMines) {
        const position = {
            i: randomNumber(boardSize),
            j: randomNumber(boardSize),
        }
        if (!positions.some(positionMatch.bind(null, position))) {
            positions.push(position)
        }
    }
    return positions
}

function positionMatch(a, b) {
    return a.i === b.i && a.j === b.j
}

function randomNumber(size) {
    return Math.floor(Math.random() * size)
}

function nearbyTiles(board, {i, j}) {
    const tiles = []
    for (let xOffset = -1; xOffset <= 1; xOffset++) {
        for (let yOffset = -1; yOffset <= 1; yOffset++) {
            const tile = board[i + xOffset]?.[j + yOffset]
            if (tile) tiles.push(tile)
        }
    }
    return tiles
}
