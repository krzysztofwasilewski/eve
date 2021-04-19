import React, { useMemo } from "react";
import usePrices from "../../hooks/usePrices";
import {
  ListChildComponentProps,
  FixedSizeList,
  ListItemKeySelector,
  areEqual,
} from "react-window";

import * as R from "ramda";
import { priceList } from "../../services/prices";
import useTypes from "../../hooks/useTypes";
import { Type } from "../../services/types";
interface PriceListProps {
  region1: string;
  region2: string;
}

const priceSelector: ListItemKeySelector = (
  index: number,
  data: PriceListChildComponentProps["data"]
) => data.prices[index].type_id;

interface PriceListChildComponentProps extends ListChildComponentProps {
  data: { prices: priceList[]; typesMap: Map<number, Type> };
}
const getNameFromId = (typesMap: Map<number, Type>) => (id: number) =>
  typesMap.get(id)?.name ?? "";

const PriceRenderer = React.memo((props: PriceListChildComponentProps) => {
  const { style, data, index } = props;

  return (
    <li style={style}>
      {data.typesMap.get(data.prices[index].type_id)?.name ?? ""}{" "}
      {data.prices[index].data[0].average} {data.prices[index].data[1].average}
      <img
        alt={`Icon of ${data.typesMap.get(data.prices[index].type_id)?.name}`}
        src={`https://images.evetech.net/types/${data.prices[index].type_id}/icon?size=32`}
      />
    </li>
  );
}, areEqual);
const PriceList = (props: PriceListProps) => {
  const { region1, region2 } = props;
  const { prices, error, loading } = usePrices(region1, region2);
  const { types } = useTypes(region1);
  const typesMap = useMemo(
    () =>
      new Map<number, Type>(
        types.map(R.converge(R.pair, [R.prop("type_id"), R.identity]))
      ),
    [types]
  );

  const data: PriceListChildComponentProps["data"] = {
    prices: R.sortBy(
      R.compose(getNameFromId(typesMap), R.prop("type_id")),
      prices
    ),
    typesMap,
  };
  return (
    <>
      {loading && "Loading…"}
      {error && "Error… Please try to refresh."}
      <FixedSizeList
        itemData={data}
        itemKey={priceSelector}
        width={900}
        height={800}
        itemSize={50}
        itemCount={prices.length}
        innerElementType="ol"
      >
        {PriceRenderer}
      </FixedSizeList>
    </>
  );
};

export default React.memo(PriceList);
