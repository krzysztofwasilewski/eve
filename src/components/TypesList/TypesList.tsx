import useTypes from "../../hooks/useTypes";
import { FixedSizeList, ListChildComponentProps, areEqual } from "react-window";
import { Type } from "../../services/types";

import * as R from "ramda";
import React from "react";

interface TypesListProps {
  regionID: string;
}

const sortByName = R.sortBy(R.prop("name"));
const pickUsefulProps = R.map(R.pick(["type_id", "name"]));

interface TypesListChildComponentProps extends ListChildComponentProps {
  data: Type[];
}

const Row = (props: TypesListChildComponentProps) => {
  const { data, index, style } = props;
  return <div style={style}> {data[index].name}</div>;
};
const RowWithMemo = React.memo(Row, areEqual);

const typeKey = (index: number, data: Type[]) => data[index].type_id;

const TypesList = (props: TypesListProps) => {
  const { regionID } = props;
  const { types, failed, loading } = useTypes(regionID);
  const sortedTypes = R.pipe(pickUsefulProps, sortByName)(types);
  return (
    <>
      {loading && <div>Loading…</div>}
      {failed && <div>Failed fetching data. Try again later.</div>}
      <FixedSizeList
        itemData={sortedTypes}
        height={800}
        itemCount={types.length}
        itemSize={40}
        width={500}
        itemKey={typeKey}
        // innerElementType="ol"
        overscanCount={10}
      >
        {RowWithMemo}
      </FixedSizeList>
    </>
  );
};

export default TypesList;
