import type { Deposit, Withdrawal } from '@autonomys/auto-consensus'
import {
  ConfirmedDomainExecutionReceipt,
  Domain,
  DomainRegistry,
  DomainStakingSummary,
  NominatorCount,
  OperatorIdOwner,
  Operators,
  PendingStakingOperationCount,
  SuccessfulBundle,
} from 'types/consensus'
import { bigIntDeserializer, bigIntSerializer } from 'utils/number'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface ConsensusDefaultState {
  // properties
  ss58Format: number
  tokenDecimals: number
  tokenSymbol: string
  // domainsBootstrapNodes: any

  domain: Domain | null
  // system
  chain: string
  name: string
  // domains
  domainRegistry: DomainRegistry[]
  domainStakingSummary: DomainStakingSummary[]
  latestConfirmedDomainExecutionReceipt: ConfirmedDomainExecutionReceipt[]
  // latestSubmittedER: LatestSubmittedER[]
  nominatorCount: NominatorCount[]
  operatorIdOwner: OperatorIdOwner[]
  operators: Operators[]
  // pendingSlashes: PendingSlashes[]
  pendingStakingOperationCount: PendingStakingOperationCount[]
  successfulBundles: SuccessfulBundle[]
  deposits: Deposit[]
  withdrawals: Withdrawal[]

  // last block number
  lastBlockNumber: number | null
}

interface ConsensusState extends ConsensusDefaultState {
  setProperties: (params: {
    ss58Format: number
    tokenDecimals: number
    tokenSymbol: string
    // domainsBootstrapNodes: any
  }) => void
  setDomain: (domain: Domain) => void
  setSystem: (params: { chain: string; name: string }) => void
  setDomainRegistry: (domainRegistry: DomainRegistry[]) => void
  setDomainStakingSummary: (domainStakingSummary: DomainStakingSummary[]) => void
  setLatestConfirmedDomainExecutionReceipt: (
    latestConfirmedDomainExecutionReceipt: ConfirmedDomainExecutionReceipt[],
  ) => void
  setNominatorCount: (nominatorCount: NominatorCount[]) => void
  setOperatorIdOwner: (operatorIdOwner: OperatorIdOwner[]) => void
  setOperators: (operators: Operators[]) => void
  setPendingStakingOperationCount: (
    pendingStakingOperationCount: PendingStakingOperationCount[],
  ) => void
  setSuccessfulBundles: (successfulBundles: SuccessfulBundle[]) => void
  setDeposits: (deposits: Deposit[]) => void
  setWithdrawals: (withdrawals: Withdrawal[]) => void
  setLastBlockNumber: (lastBlockNumber: number) => void
  clear: () => void
}

const initialState: ConsensusDefaultState = {
  ss58Format: 0,
  tokenDecimals: 0,
  tokenSymbol: '',
  // domainsBootstrapNodes: null,

  domain: null,
  // system
  chain: '',
  name: '',
  // domains
  domainRegistry: [],
  domainStakingSummary: [],
  latestConfirmedDomainExecutionReceipt: [],
  // latestSubmittedER: [],
  nominatorCount: [],
  operatorIdOwner: [],
  operators: [],
  // pendingSlashes: [],
  pendingStakingOperationCount: [],
  successfulBundles: [],
  deposits: [],
  withdrawals: [],

  // last block number
  lastBlockNumber: null,
}

export const useConsensusStates = create<ConsensusState>()(
  persist(
    (set) => ({
      ...initialState,
      setProperties: (params) =>
        set(() => ({
          ss58Format: params.ss58Format,
          tokenSymbol: params.tokenSymbol,
          tokenDecimals: params.tokenDecimals,
          // domainsBootstrapNodes: params.domainsBootstrapNodes,
        })),
      setDomain: (domain) => set(() => ({ domain })),
      setSystem: (params) => set(() => ({ chain: params.chain, name: params.name })),
      setDomainRegistry: (domainRegistry) => set(() => ({ domainRegistry })),
      setDomainStakingSummary: (domainStakingSummary) => set(() => ({ domainStakingSummary })),
      setLatestConfirmedDomainExecutionReceipt: (latestConfirmedDomainExecutionReceipt) =>
        set(() => ({ latestConfirmedDomainExecutionReceipt })),
      setNominatorCount: (nominatorCount) => set(() => ({ nominatorCount })),
      setOperatorIdOwner: (operatorIdOwner) => set(() => ({ operatorIdOwner })),
      setOperators: (operators) => set(() => ({ operators })),
      setPendingStakingOperationCount: (pendingStakingOperationCount) =>
        set(() => ({ pendingStakingOperationCount })),
      setSuccessfulBundles: (successfulBundles) => set(() => ({ successfulBundles })),
      setDeposits: (deposits) => set(() => ({ deposits })),
      setWithdrawals: (withdrawals) => set(() => ({ withdrawals })),
      setLastBlockNumber: (lastBlockNumber) => set(() => ({ lastBlockNumber })),
      clear: () => set(() => ({ ...initialState })),
    }),
    {
      name: 'consensus-storage',
      version: 3,
      storage: createJSONStorage(() => localStorage),
      serialize: (state) => JSON.stringify(state, bigIntSerializer),
      deserialize: (str) => JSON.parse(str, bigIntDeserializer),
    },
  ),
)
