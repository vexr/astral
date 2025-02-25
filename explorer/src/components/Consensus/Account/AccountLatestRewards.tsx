import { StatusIcon } from '@/components/common/StatusIcon'
import { Tooltip } from '@/components/common/Tooltip'
import { INTERNAL_ROUTES } from 'constants/routes'
import { AccountByIdQuery } from 'gql/graphql'
import useIndexers from 'hooks/useIndexers'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { FC } from 'react'
import { useConsensusStates } from 'states/consensus'
import { AccountIdParam } from 'types/app'
import { bigNumberToNumber } from 'utils/number'

interface AccountLatestRewardsProps {
  isDesktop: boolean
  rewards: AccountByIdQuery['consensus_rewards']
}

export const AccountLatestRewards: FC<AccountLatestRewardsProps> = ({ rewards }) => {
  const { network, section, tokenSymbol } = useIndexers()
  const { accountId } = useParams<AccountIdParam>()
  const lastBlockNumber = useConsensusStates((state) => state.lastBlockNumber)
  const { push } = useRouter()

  return (
    <div className='flex w-full flex-col rounded-[20px] border border-gray-200 px-4 dark:border-none'>
      <div className='flex w-full flex-col gap-6 pl-4'>
        <div className='flex w-full justify-between'>
          <div className='text-blueShade flex-1 grow text-[13px] font-normal dark:text-white/75'>
            Block Number
          </div>
          <div className='text-blueShade flex-1 grow text-center text-[13px] font-normal dark:text-white/75'>
            Type
          </div>
          <div className='text-blueShade flex-1 grow text-end text-[13px] font-normal dark:text-white/75'>
            Amount
          </div>
        </div>
        <div className='w-full'>
          <ol className='dark:border-buttonDarkFrom border-buttonLightFrom relative w-full border-l'>
            {rewards.map(({ id, rewardType, blockHeight, amount }, index) => {
              const confirmations = lastBlockNumber ? Math.max(0, lastBlockNumber - blockHeight) : 0
              return (
                <li
                  key={`${id}-account-rewards-block`}
                  className={`flex w-full justify-between ${
                    index !== rewards.length - 1 && 'mb-[26px]'
                  }`}
                >
                  <div className='w-full flex-1 grow'>
                    <div
                      className={`absolute -left-1.5 size-3 rounded-full ${
                        index === 0
                          ? 'bg-primaryAccent dark:bg-primaryAccent'
                          : 'bg-buttonDarkFrom dark:bg-buttonDarkTo'
                      }`}
                    ></div>
                    <div className='-mt-1 ml-4 flex-1 grow text-[13px] font-normal text-grayDark dark:text-white '>
                      <Link
                        key={`${id}-account-index`}
                        className='hover:text-primaryAccent'
                        href={INTERNAL_ROUTES.blocks.id.page(network, section, blockHeight)}
                      >
                        {blockHeight}
                      </Link>
                      <Tooltip
                        text={
                          <span className='whitespace-nowrap'>{`${confirmations} confirmations`}</span>
                        }
                        direction='top'
                      >
                        <StatusIcon status={confirmations >= 10} isPending={confirmations < 10} />
                      </Tooltip>
                    </div>
                    <div className='-mt-1 w-full flex-1 grow text-center text-[13px] font-normal text-grayDark dark:text-white'>
                      {rewardType
                        .split('.')[1]
                        .split(/(?=[A-Z])/)
                        .join(' ')}
                    </div>
                    <div className='-mt-1 w-full flex-1 grow text-end text-[13px] font-normal text-grayDark dark:text-white'>
                      {bigNumberToNumber(amount)} {tokenSymbol}
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
      {rewards.length > 0 ? (
        <button
          onClick={() =>
            push(INTERNAL_ROUTES.accounts.rewards.page(network, section, accountId || ''))
          }
          className='bg-blueLight mt-4 w-full rounded-[20px] py-4 dark:bg-whiteTransparent dark:text-white'
        >
          See All Rewards
        </button>
      ) : (
        <div className='mt-5 flex size-full justify-center rounded-[20px] py-4 align-middle text-[13px] font-semibold text-gray-900 dark:text-white'>
          No Rewards
        </div>
      )}
    </div>
  )
}
