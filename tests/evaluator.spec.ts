require("tsconfig-paths/register");
import { LetterState, IHintLetter } from "../src/app/constants";
import Evaluator from "../src/app/evaluator";

const TESTS_TESTS: IHintLetter[] = [
    { letter: "t", state: LetterState.CORRECT },
    { letter: "e", state: LetterState.CORRECT },
    { letter: "s", state: LetterState.CORRECT },
    { letter: "t", state: LetterState.CORRECT },
    { letter: "s", state: LetterState.CORRECT },
];

const ERROR_TESTS: IHintLetter[] = [
    { letter: "e", state: LetterState.PRESENT },
    { letter: "r", state: LetterState.ABSENT },
    { letter: "r", state: LetterState.ABSENT },
    { letter: "o", state: LetterState.ABSENT },
    { letter: "r", state: LetterState.ABSENT },
];

const WRONG_TESTS: IHintLetter[] = [
    { letter: "w", state: LetterState.ABSENT },
    { letter: "r", state: LetterState.ABSENT },
    { letter: "o", state: LetterState.ABSENT },
    { letter: "n", state: LetterState.ABSENT },
    { letter: "g", state: LetterState.ABSENT },
];

const REPEATED_SPEED_ABIDE: IHintLetter[] = [
    { letter: "s", state: LetterState.ABSENT },
    { letter: "p", state: LetterState.ABSENT },
    { letter: "e", state: LetterState.PRESENT },
    { letter: "e", state: LetterState.ABSENT },
    { letter: "d", state: LetterState.PRESENT },
];

const REPEATED_SPEED_ERASE: IHintLetter[] = [
    { letter: "s", state: LetterState.PRESENT },
    { letter: "p", state: LetterState.ABSENT },
    { letter: "e", state: LetterState.PRESENT },
    { letter: "e", state: LetterState.PRESENT },
    { letter: "d", state: LetterState.ABSENT },
];

const REPEATED_SPEED_STEAL: IHintLetter[] = [
    { letter: "s", state: LetterState.CORRECT },
    { letter: "p", state: LetterState.ABSENT },
    { letter: "e", state: LetterState.CORRECT },
    { letter: "e", state: LetterState.ABSENT },
    { letter: "d", state: LetterState.ABSENT },
];

const REPEATED_SPEED_CREPE: IHintLetter[] = [
    { letter: "s", state: LetterState.ABSENT },
    { letter: "p", state: LetterState.PRESENT },
    { letter: "e", state: LetterState.CORRECT },
    { letter: "e", state: LetterState.PRESENT },
    { letter: "d", state: LetterState.ABSENT },
];

const REPEATED_EMEER_SPEED: IHintLetter[] = [
    { letter: "e", state: LetterState.ABSENT },
    { letter: "m", state: LetterState.ABSENT },
    { letter: "e", state: LetterState.CORRECT },
    { letter: "e", state: LetterState.CORRECT },
    { letter: "r", state: LetterState.ABSENT },
];

describe("Evaluator", () => {
    it("should normalize guesses into lowercase", () => {
        expect(Evaluator.normalizeGuess("TeStS")).toBe("tests");
    });

    it("should remove non-letter characters from guess", () => {
        expect(Evaluator.normalizeGuess("té5t*")).toBe("tt");
    });

    it("should remove extra characters from guess", () => {
        expect(Evaluator.normalizeGuess("testsssssss")).toBe("tests");
    });

    it("should evaluate a correct guess correctly", () => {
        expect(Evaluator.evaluateGuess("tests", "tests")).toEqual(TESTS_TESTS);
    });

    it("should evaluate an incorrect guess correctly", () => {
        expect(Evaluator.evaluateGuess("tests", "wrong")).toEqual(WRONG_TESTS);
    });

    it("should evaluate a slightly correct guess correctly", () => {
        expect(Evaluator.evaluateGuess("tests", "error")).toEqual(ERROR_TESTS);
    });

    it("should know when a guess is the same as the answer", () => {
        expect(Evaluator.isGuessCorrect("tests", "tests")).toBe(true);
    });

    it("should know when a guess is not the same as the answer", () => {
        expect(Evaluator.isGuessCorrect("tests", "wrong")).toBe(false);
    });

    it("should know when a guess is a valid word", () => {
        expect(Evaluator.isGuessValidWord("tests")).toBe(true);
        expect(Evaluator.isGuessValidWord("zzxzz")).toBe(false);
    });

    it("should know when a guess has an absent letter", () => {
        expect(Evaluator.hasAbsentLetter("tests", new Set(["a", "b", "c", "d"]))).toBe(false);
        expect(Evaluator.hasAbsentLetter("tests", new Set(["a", "b", "c", "d", "e"]))).toBe(true);
    });

    it("should know when a guess has a discovered present letter", () => {
        expect(Evaluator.hasPresentLetters("tests", new Set([]))).toBe(true);
        expect(Evaluator.hasPresentLetters("tests", new Set(["t"]))).toBe(true);
    });

    it("should know when a guess doesn't have a discovered present letter", () => {
        expect(Evaluator.hasPresentLetters("tests", new Set(["a"]))).toBe(false);
        expect(Evaluator.hasPresentLetters("tests", new Set(["t", "e", "s", "t", "a"]))).toBe(false);
    });

    it("should know when a guess has a correct letter in the correct position", () => {
        expect(Evaluator.hasCorrectLettersInPosition("tests", ["", "", "", "", ""])).toBe(true);
        expect(Evaluator.hasCorrectLettersInPosition("tests", ["t", "", "", "", ""])).toBe(true);
        expect(Evaluator.hasCorrectLettersInPosition("tests", ["t", "e", "s", "t", ""])).toBe(true);
        expect(Evaluator.hasCorrectLettersInPosition("tests", ["t", "e", "s", "t", "s"])).toBe(true);
    });

    it("should know when a guess doesn't have a correct letter in the correct position", () => {
        expect(Evaluator.hasCorrectLettersInPosition("error", ["t", "", "", "", ""])).toBe(false);
        expect(Evaluator.hasCorrectLettersInPosition("error", ["", "e", "", "", ""])).toBe(false);
        expect(Evaluator.hasCorrectLettersInPosition("error", ["a", "r", "r", "o", "r"])).toBe(false);
    });

    it("should know when a repeated letter is absent (SPEED -> ABIDE/STEAL)", () => {
        expect(Evaluator.evaluateGuess("abide", "speed")).toEqual(REPEATED_SPEED_ABIDE);
        expect(Evaluator.evaluateGuess("steal", "speed")).toEqual(REPEATED_SPEED_STEAL);
    });

    it("should know when two repeated letters are present (SPEED -> ERASE)", () => {
        expect(Evaluator.evaluateGuess("erase", "speed")).toEqual(REPEATED_SPEED_ERASE);
    });

    it("should know when a repeated letter is correct and present (SPEED -> CREPE)", () => {
        expect(Evaluator.evaluateGuess("crepe", "speed")).toEqual(REPEATED_SPEED_CREPE);
    });

    it("should know when the repeated present letter comes before the correct letters (SPEED -> EMEER)", () => {
        expect(Evaluator.evaluateGuess("speed", "emeer")).toEqual(REPEATED_EMEER_SPEED);
    });
});
