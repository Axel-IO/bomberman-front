import { Socket } from "socket.io-client";
// import { IPlayMatrix, IStartGame } from "../../components/game/indexOLD";
import { Player, Square } from "./type";

class GameService {
    // public joinGameRoom(socket: Socket, roomId: string): Promise<boolean> {
    //     return new Promise((rs, rj) => {
    //         socket.emit("join_game", { roomId });
    //         socket.on("room_joined", () => rs(true));
    //         socket.on("room_join_error", ({ error }) => rj(error));
    //     });
    // }

    // public updateGame(socket: Socket, gameMatrix: IPlayMatrix) {
    //     socket.emit("update_game", { matrix: gameMatrix });
    // }

    // public onGameUpdate(
    //     socket: Socket,
    //     listener: (matrix: IPlayMatrix) => void
    // ) {
    //     socket.on("on_game_update", ({ matrix }) => listener(matrix));
    // }

    // public onStartGame(
    //     socket: Socket,
    //     listener: (options: IStartGame) => void
    // ) {
    //     socket.on("start_game", listener);
    // }

    // public gameWin(socket: Socket, message: string) {
    //     socket.emit("game_win", { message });
    // }

    // public onGameWin(socket: Socket, listener: (message: string) => void) {
    //     socket.on("on_game_win", ({ message }) => listener(message));
    // }

    public onInitBoard(socket: Socket, listener: (board: Square[][]) => void) {
        socket.on("init_board", (board: Square[][]) => {
            listener(board);
        });
    }

    public movePlayer(
        socket: Socket,
        message: { maxWidth: number; maxHeight: number; direction: string }
    ) {
        socket.emit("move_player", message);
    }

    public onUpdatePlayers(socket: Socket, listener: (players: Player[]) => void) {
        socket.on("update_players", (playersObj) => {
            const players: Player[] = Object.values(playersObj);
            listener(players);
        });
    }
}

export default new GameService();
