/**
 * Bitcoin address generation and validation utilities
 * Uses HD (Hierarchical Deterministic) wallet generation for security
 */

import * as bitcoin from "bitcoinjs-lib";
import { BIP32Factory, BIP32Interface } from "bip32";
import * as ecc from "tiny-secp256k1";
import { randomBytes, createHash, pbkdf2Sync } from "crypto";

// Lazy initialization of BIP32 to avoid module load-time errors
let bip32Instance: ReturnType<typeof BIP32Factory> | null = null;

function getBIP32() {
    if (!bip32Instance) {
        try {
            bip32Instance = BIP32Factory(ecc);
        } catch (error) {
            console.error("Failed to initialize BIP32:", error);
            throw new Error(`BIP32 initialization failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    return bip32Instance;
}

/**
 * Bitcoin network configuration
 * Using mainnet - change to bitcoin.networks.testnet for testing
 */
const NETWORK = bitcoin.networks.bitcoin;

/**
 * BIP44 derivation path for Bitcoin mainnet
 * Format: m/44'/0'/0'/0/0
 * - 44' = BIP44 standard
 * - 0' = Bitcoin
 * - 0' = Account index
 * - 0 = Change (0 = external, 1 = internal)
 * - 0 = Address index
 */
const DERIVATION_PATH = "m/44'/0'/0'/0/0";

/**
 * Generates a cryptographically secure Bitcoin address
 * Uses HD wallet derivation for security
 * 
 * @param userId - Unique user identifier for deterministic address generation
 * @returns A valid Bitcoin Bech32 (native SegWit) address
 */
export function generateBitcoinAddress(userId: string): string {
    try {
        // Generate a deterministic seed from userId + master secret
        // In production, use a secure master key stored in environment variables
        const masterSecret = process.env.BITCOIN_MASTER_SECRET || "CHANGE_THIS_IN_PRODUCTION";

        if (!masterSecret || masterSecret === "CHANGE_THIS_IN_PRODUCTION") {
            console.warn("Warning: Using default BITCOIN_MASTER_SECRET. Set a secure value in production!");
        }

        const seed = createDeterministicSeed(userId, masterSecret);

        // Validate seed size (BIP32 requires 16-64 bytes)
        if (seed.length < 16 || seed.length > 64) {
            throw new Error(`Invalid seed size: ${seed.length} bytes. Must be 16-64 bytes.`);
        }

        // Create root node from seed
        const bip32 = getBIP32();
        let root;
        try {
            root = bip32.fromSeed(seed, NETWORK);
        } catch (bip32Error) {
            console.error("BIP32 fromSeed error:", bip32Error);
            throw new Error(`BIP32 fromSeed failed: ${bip32Error instanceof Error ? bip32Error.message : String(bip32Error)}`);
        }

        // Derive child key using BIP44 path
        // For unique addresses per user, we can use userId hash as address index
        const addressIndex = hashToNumber(userId) % 2147483647; // Max BIP32 index
        const childPath = `m/44'/0'/0'/0/${addressIndex}`;

        let child;
        try {
            child = root.derivePath(childPath);
        } catch (deriveError) {
            console.error("Key derivation error:", deriveError);
            throw new Error(`Key derivation failed: ${deriveError instanceof Error ? deriveError.message : String(deriveError)}`);
        }

        // Generate P2WPKH (Pay-to-Witness-Public-Key-Hash) address (Bech32)
        // This is the modern, recommended format with lower fees
        let address;
        try {
            const payment = bitcoin.payments.p2wpkh({
                pubkey: child.publicKey,
                network: NETWORK,
            });
            address = payment.address;
        } catch (paymentError) {
            console.error("Payment generation error:", paymentError);
            throw new Error(`Payment generation failed: ${paymentError instanceof Error ? paymentError.message : String(paymentError)}`);
        }

        if (!address) {
            throw new Error("Failed to generate Bitcoin address: address is null");
        }

        return address;
    } catch (error) {
        console.error("Error generating Bitcoin address:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to generate secure Bitcoin address: ${errorMessage}`);
    }
}

/**
 * Creates a deterministic seed from userId and master secret
 * This ensures the same userId always generates the same address
 * BIP32 requires seed to be 16-64 bytes, we use 64 bytes for optimal security
 */
function createDeterministicSeed(userId: string, masterSecret: string): Buffer {
    const combined = `${userId}:${masterSecret}`;
    // Use PBKDF2 to derive a 64-byte seed (512 bits) for BIP32
    // This is more secure than just SHA256 and produces the optimal seed size
    return pbkdf2Sync(combined, "bitcoin-wallet-seed", 10000, 64, "sha512");
}

/**
 * Converts a string to a number for use as address index
 */
function hashToNumber(input: string): number {
    const hash = createHash("sha256").update(input).digest();
    return hash.readUInt32BE(0);
}

/**
 * Validates a Bitcoin address format
 * Supports all Bitcoin address formats:
 * - Legacy (P2PKH): Starts with '1'
 * - P2SH: Starts with '3'
 * - Bech32 (Native SegWit): Starts with 'bc1'
 * - Taproot: Starts with 'bc1p'
 * 
 * @param address - Bitcoin address to validate
 * @returns true if address is valid, false otherwise
 */
export function validateBitcoinAddress(address: string): boolean {
    if (!address || typeof address !== "string") {
        return false;
    }

    // Remove whitespace
    const cleanAddress = address.trim();

    if (cleanAddress.length < 26 || cleanAddress.length > 62) {
        return false;
    }

    try {
        // Try to decode the address using bitcoinjs-lib
        // This validates checksums and formats
        bitcoin.address.toOutputScript(cleanAddress, NETWORK);
        return true;
    } catch (error) {
        // Address format is invalid
        return false;
    }
}

/**
 * Gets the address type (for informational purposes)
 */
export function getAddressType(address: string): "legacy" | "p2sh" | "bech32" | "taproot" | "invalid" {
    if (!validateBitcoinAddress(address)) {
        return "invalid";
    }

    if (address.startsWith("bc1p")) {
        return "taproot";
    }
    if (address.startsWith("bc1")) {
        return "bech32";
    }
    if (address.startsWith("3")) {
        return "p2sh";
    }
    if (address.startsWith("1")) {
        return "legacy";
    }

    return "invalid";
}

