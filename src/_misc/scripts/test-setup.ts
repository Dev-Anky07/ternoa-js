import { BN } from "bn.js"
import dotenv from "dotenv"
import { getKeyringFromSeed } from "../../account"
import { getBalance, transferAll, transferKeepAlive } from "../../balance"
import { PAIRSSR25519 } from "../testingPairs"

dotenv.config()

const timer = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

module.exports = async () => {
  if (!process.env.SEED_TEST_FUNDS) throw new Error("Test can't process without seed to get test funds")
  const keyring = await getKeyringFromSeed(process.env.SEED_TEST_FUNDS)
  const pairs = PAIRSSR25519
  //If some pairs contains caps, we send all to funds account
  for (const pair of pairs) {
    const pairBalance = await getBalance(pair.publicKey)
    if (pairBalance.cmp(new BN("100000000000000000000")) === 1) {
      const pairKeyring = await getKeyringFromSeed(pair.seed)
      await transferAll(keyring.address, true, pairKeyring)
    }
  }
  await timer(5000)
  //Then we send equal share to each test pair
  const balance = await getBalance(keyring.address)
  if (balance.cmp(new BN("100000000000000000000")) === 1) {
    const share = balance.sub(new BN("100000000000000000000")).div(new BN(pairs.length))
    for (const pair of pairs) {
      await transferKeepAlive(keyring.address, pair.publicKey, share, keyring)
    }
  }
  await timer(5000)
}