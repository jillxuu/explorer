import {AptosClient, Types} from "aptos";
import {useState, useMemo} from "react";
import {getValidatorCommission} from "..";
import {DELEGATION_POOL_ADDRESS} from "../../constants";
import {useGlobalState} from "../../GlobalState";
import {useGetAccountResource} from "./useGetAccountResource";
import {useGetValidatorSet} from "./useGetValidatorSet";

interface DelegationPool {
  active_shares: {
    total_coins: string;
  };
}

type DelegationNodeInfoResponse = {
  delegatedStakeAmount: string | undefined;
  networkPercentage?: string;
  commission: number | undefined;
  isQueryLoading: boolean;
};

type DelegationNodeInfoProps = {
  validatorAddress: Types.Address;
};

export function useGetDelegationNodeInfo({
  validatorAddress,
}: DelegationNodeInfoProps): DelegationNodeInfoResponse {
  const [state, _] = useGlobalState();
  const {totalVotingPower} = useGetValidatorSet();
  const {data: delegationPool, isLoading} = useGetAccountResource(
    validatorAddress,
    `${DELEGATION_POOL_ADDRESS}::delegation_pool::DelegationPool`,
  );
  const client = new AptosClient(state.network_value);
  const [commission, setCommission] = useState<Types.MoveValue>();
  const [delegatedStakeAmount, setDelegatedStakeAmount] = useState<string>();
  const [networkPercentage, setNetworkPercentage] = useState<string>();
  const [isQueryLoading, setIsQueryLoading] = useState<boolean>(true);

  useMemo(() => {
    if (!isLoading) {
      const fetchData = async () => {
        setCommission(await getValidatorCommission(client, validatorAddress));
      };
      fetchData();
      const totalDelegatedStakeAmount = (delegationPool?.data as DelegationPool)
        ?.active_shares?.total_coins;
      setDelegatedStakeAmount(totalDelegatedStakeAmount);
      setNetworkPercentage(
        (
          (parseInt(totalDelegatedStakeAmount) / parseInt(totalVotingPower!)) *
          100
        ).toFixed(2),
      );
      setIsQueryLoading(false);
    }
  }, [state.network_value, isLoading, delegationPool, totalVotingPower]);

  return {
    commission: commission ? Number(commission) / 100 : undefined, // commission rate: 22.85% is represented as 2285
    networkPercentage,
    delegatedStakeAmount,
    isQueryLoading,
  };
}
