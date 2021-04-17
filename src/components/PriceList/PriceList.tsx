import React from "react";
import usePrices, { priceList } from "../../hooks/usePrices";
import {
  ListChildComponentProps,
  FixedSizeListProps,
  FixedSizeList,
  ListItemKeySelector,
  areEqual,
} from "react-window";
interface PriceListProps {
  region1: string;
  region2: string;
}

const priceSelector: ListItemKeySelector = (index: number, data: priceList[]) =>
  data[index].type_id;

interface PriceListChildComponentProps extends ListChildComponentProps {
  data: priceList[];
}

const PriceRenderer = React.memo((props: PriceListChildComponentProps) => {
  const { style, data, index } = props;
  return (
    <li style={style}>
      {data[index].type_id} {data[index].data[0].average}{" "}
      {data[index].data[1].average}
    </li>
  );
}, areEqual);
const PriceList = (props: PriceListProps) => {
  const { region1, region2 } = props;
  const prices = usePrices(region1, region2);
  return (
    <FixedSizeList
      itemData={prices}
      itemKey={priceSelector}
      width={900}
      height={800}
      itemSize={50}
      itemCount={prices.length}
      innerElementType="ol"
    >
      {PriceRenderer}
    </FixedSizeList>
  );
};

export default React.memo(PriceList);
