"use server";

import { cookies } from "next/headers";
import { ActionResult, success, failure } from "@/lib/utils/result";

const CAPTCHA_COOKIE_NAME = "kubera_captcha";
const CAPTCHA_MAX_AGE = 60 * 5; // 5 minutes

interface CaptchaChallenge {
    question: string;
    answer: number;
}

/**
 * Generates a random math CAPTCHA challenge
 */
function generateCaptcha(): CaptchaChallenge {
    const operations = [
        { type: "add", fn: (a: number, b: number) => a + b, symbol: "+" },
        { type: "subtract", fn: (a: number, b: number) => a - b, symbol: "-" },
        { type: "multiply", fn: (a: number, b: number) => a * b, symbol: "×" },
    ];

    const operation = operations[Math.floor(Math.random() * operations.length)];

    // Generate numbers based on operation type
    let num1: number, num2: number;

    if (operation.type === "multiply") {
        // For multiplication, use smaller numbers (1-10)
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
    } else if (operation.type === "subtract") {
        // For subtraction, ensure positive result
        num1 = Math.floor(Math.random() * 50) + 20;
        num2 = Math.floor(Math.random() * num1) + 1;
    } else {
        // For addition, use numbers 1-50
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
    }

    const answer = operation.fn(num1, num2);
    const question = `${num1} ${operation.symbol} ${num2}`;

    return { question, answer };
}

/**
 * Stores CAPTCHA answer in a cookie
 */
async function storeCaptchaAnswer(answer: number): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(CAPTCHA_COOKIE_NAME, answer.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: CAPTCHA_MAX_AGE,
        path: "/",
    });
}

/**
 * Gets and validates CAPTCHA answer from cookie
 */
async function getCaptchaAnswer(): Promise<number | null> {
    const cookieStore = await cookies();
    const answerStr = cookieStore.get(CAPTCHA_COOKIE_NAME)?.value;

    if (!answerStr) {
        return null;
    }

    const answer = parseInt(answerStr, 10);
    return isNaN(answer) ? null : answer;
}

/**
 * Clears CAPTCHA cookie after validation
 */
async function clearCaptcha(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(CAPTCHA_COOKIE_NAME);
}

/**
 * Generates a new CAPTCHA challenge and stores the answer
 */
export async function generateCaptchaChallenge(): Promise<ActionResult<{ question: string }>> {
    try {
        const captcha = generateCaptcha();
        await storeCaptchaAnswer(captcha.answer);

        return success({ question: captcha.question });
    } catch (error) {
        console.error("Error generating CAPTCHA:", error);
        return failure("Failed to generate CAPTCHA challenge");
    }
}

/**
 * Validates a CAPTCHA answer
 */
export async function validateCaptchaAnswer(userAnswer: string): Promise<ActionResult<boolean>> {
    try {
        const expectedAnswer = await getCaptchaAnswer();

        if (expectedAnswer === null) {
            return failure("CAPTCHA expired. Please refresh the page.");
        }

        const parsedAnswer = parseInt(userAnswer.trim(), 10);

        if (isNaN(parsedAnswer)) {
            return failure("CAPTCHA answer must be a number");
        }

        if (parsedAnswer !== expectedAnswer) {
            // Clear the CAPTCHA so user gets a new one
            await clearCaptcha();
            return failure("Incorrect CAPTCHA answer. Please try again.");
        }

        // Clear CAPTCHA after successful validation
        await clearCaptcha();

        return success(true);
    } catch (error) {
        console.error("Error validating CAPTCHA:", error);
        return failure("Failed to validate CAPTCHA");
    }
}

