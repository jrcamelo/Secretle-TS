import { GameState, DEFAULT_LIVES, LetterState, IHintLetter } from './constants';
import Dictionary from './dictionary';
import Evaluator from './evaluator';
import Status from './status';

export default class Wordle {

    public answer: string;
    public hardMode: boolean;

    public tries: number;
    public gameState: GameState = GameState.PLAYING;
    public status: Status = new Status;
    public guesses: IHintLetter[][] = [];

    public dictionary: Dictionary;

    constructor(hardMode: boolean = false, tries: number = DEFAULT_LIVES) {
        this.dictionary = Dictionary.getInstance();
        this.answer = this.dictionary.getRandomSecret();
        this.hardMode = hardMode;
        this.tries = tries;
    }

    public tryGuess(guess: string): void {
        this.checkGameState();
        this.checkValidGuess(guess);

        guess = Evaluator.normalizeGuess(guess);
        if (Evaluator.isGuessCorrect(this.answer, guess)) {
            this.gameState = GameState.WON;
            return;
        }
        const result = this.evaluateGuess(guess);
        this.updateStatusAndGuesses(result);
        this.checkForWinOrLoss(result);
    }

    public checkGameState(): void {
        if (this.gameState !== GameState.PLAYING) {
            throw new Error("Game is not in playing state");
        }
    }

    public checkValidGuess(guess: string): void {
        if (guess.length != 5) {
            throw new Error("Guess must be 5 characters long");
        }
        if (this.hardMode) {
            if (Evaluator.hasAbsentLetter(guess, this.status.absentLetters)) {
                throw new Error("Guess contains absent letter in hard mode");
            }
        }
        if (!Evaluator.isGuessValidWord(guess)) {
            throw new Error("Guess is not a valid word");
        }
    }

    public evaluateGuess(guess: string): IHintLetter[] {
        return Evaluator.evaluateGuess(this.answer, guess);
    }

    public updateStatusAndGuesses(result: IHintLetter[]): void {
        this.guesses.push(result);
        this.status.update(result);
    }

    public checkForWinOrLoss(result: IHintLetter[]): void {
        if (result.every(hint => hint.state === LetterState.CORRECT)) {
            this.gameState = GameState.WON;
        } else {        
            this.tries--;
            if (this.tries === 0) {
                this.gameState = GameState.LOST;
            }
        }
    }

    public toTally(): Map<string, any> {
        const tally = new Map<string, any>();
        tally.set("gameState", this.gameState);
        tally.set("tries", this.tries);
        tally.set("guesses", this.guesses);
        tally.set("absentLetters", Array.from(this.status.absentLetters));
        tally.set("presentLetters", Array.from(this.status.presentLetters));
        tally.set("correctLetters", this.status.correctLetters);
        if (this.gameState != GameState.PLAYING) {
            tally.set("answer", this.answer);
        }
        return tally;
    }


}