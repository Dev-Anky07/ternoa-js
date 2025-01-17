import { initializeApi } from "../blockchain"
import { getMarketplaceOffchainDataLimit, getMarketplaceAccountSizeLimit } from "./constants"

beforeAll(() => {
  const endpoint: string | undefined = process.env.BLOCKCHAIN_ENDPOINT
  return initializeApi(endpoint)
})

it("Testing marketplace offchain data size limit to be 150", async () => {
  const actual = await getMarketplaceOffchainDataLimit()
  const expected = 150
  expect(actual).toEqual(expected)
})

it("Testing marketplace account size limit to be 100 000", async () => {
  const actual = await getMarketplaceAccountSizeLimit()
  const expected = 100000
  expect(actual).toEqual(expected)
})
