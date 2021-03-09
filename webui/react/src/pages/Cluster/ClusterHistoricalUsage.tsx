import { Button, Col, Row } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

import Section from 'components/Section';
import Spinner from 'components/Spinner';
import { parseUrl } from 'routes/utils';

import css from './ClusterHistoricalUsage.module.scss';
import ClusterHistoricalUsageCsvModal from './ClusterHistoricalUsageCsvModal';
import ClusterHistoricalUsageFilters, {
  ClusterHistoricalUsageFiltersInterface,
} from './ClusterHistoricalUsageFilters';

export const DEFAULT_RANGE_DAY = 14;
export const DEFAULT_RANGE_MONTH = 6;
export const MAX_RANGE_DAY = 30;
export const MAX_RANGE_MONTH = 36;

enum GroupBy {
  Day = 'day',
  Month = 'month',
}

const ClusterHistoricalUsage: React.FC = () => {
  const [ filters, setFilters ] = useState<ClusterHistoricalUsageFiltersInterface>({
    afterDate: dayjs().subtract(1 + DEFAULT_RANGE_DAY, 'day'),
    beforeDate: dayjs().subtract(1, 'day'),
    groupBy: GroupBy.Day,
  });
  const [ isCsvModalVisible, setIsCsvModalVisible ] = useState<boolean>(false);
  const [ isLoading, setIsLoading ] = useState<boolean>(true);
  const [ isUrlParsed, setIsUrlParsed ] = useState<boolean>(false);

  /*
  * When filters changes update the page URL.
  */
  useEffect(() => {
    if (!isUrlParsed) return;

    const dateFormat = 'YYYY-MM' + (filters.groupBy === GroupBy.Day ? '-DD' : '');
    const searchParams = new URLSearchParams;
    const url = parseUrl(window.location.href);

    // after
    searchParams.append('after', filters.afterDate.format(dateFormat));

    // before
    searchParams.append('before', filters.beforeDate.format(dateFormat));

    // group-by
    searchParams.append('group-by', filters.groupBy);

    window.history.pushState(
      {},
      '',
      url.origin + url.pathname + '?' + searchParams.toString(),
    );
  }, [ filters, isUrlParsed ]);

  /*
   * On first load: if filters are specified in URL, override default.
   */
  useEffect(() => {
    if (isUrlParsed) return;

    const urlSearchParams = parseUrl(window.location.href).searchParams;

    // after
    const after = dayjs(urlSearchParams.get('after') || '');
    if (after.isValid() && after.isBefore(dayjs())) {
      filters.afterDate = after;
    }

    // before
    const before = dayjs(urlSearchParams.get('before') || '');
    if (before.isValid() && before.isBefore(dayjs())) {
      filters.beforeDate = before;
    }

    // group-by
    const groupBy = urlSearchParams.get('group-by');
    if (groupBy != null && Object.values(GroupBy).includes(groupBy as GroupBy)) {
      filters.groupBy = groupBy as GroupBy;
    }

    // check valid dates
    const dateDiff = filters.beforeDate.diff(filters.afterDate, filters.groupBy);
    if (filters.groupBy === GroupBy.Day && (dateDiff >= MAX_RANGE_DAY || dateDiff < 1)) {
      filters.afterDate = filters.beforeDate.clone().subtract(MAX_RANGE_DAY - 1, 'day');
    }
    if (filters.groupBy === GroupBy.Month && (dateDiff >= MAX_RANGE_MONTH || dateDiff < 1)) {
      filters.afterDate = filters.beforeDate.clone().subtract(MAX_RANGE_MONTH - 1, 'month');
    }

    setFilters(filters);
    setIsUrlParsed(true);
  }, [ filters, isUrlParsed ]);

  // when grouped by month force csv modal to display start/end of month
  let csvAfterDate = filters.afterDate;
  let csvBeforeDate = filters.beforeDate;
  if (filters.groupBy === GroupBy.Month) {
    csvAfterDate = csvAfterDate.startOf('month');
    csvBeforeDate = csvBeforeDate.endOf('month');
    if (csvBeforeDate.isAfter(dayjs())) {
      csvBeforeDate = dayjs().startOf('day');
    }
  }

  // todo: chart
  // todo: chart have max 5 labels, then group in "others"

  return (
    <>
      <Row className={css.filter} gutter={32} justify="end">
        <Col>
          <ClusterHistoricalUsageFilters
            value={filters}
            onChange={setFilters}
          />
        </Col>
        <Col>
          <Button onClick={() => setIsCsvModalVisible(true)}>
            Download CSV
          </Button>
        </Col>
      </Row>

      <Section bodyBorder bodyRelative title="GPU Hours Allocated">
        { isLoading ? <Spinner /> : <h1>CHART</h1>}
      </Section>

      <Section bodyBorder bodyRelative title="GPU Hours by User">
        { isLoading ? <Spinner /> : <h1>CHART</h1>}
      </Section>

      <Section bodyBorder bodyRelative title="GPU Hours by Label">
        { isLoading ? <Spinner /> : <h1>CHART</h1>}
      </Section>

      <Section bodyBorder bodyRelative title="GPU Hours by Resource Pool">
        { isLoading ? <Spinner /> : <h1>CHART</h1>}
      </Section>

      <Section bodyBorder bodyRelative title="GPU Hours by Agent Label">
        { isLoading ? <Spinner /> : <h1>CHART</h1>}
      </Section>

      {isCsvModalVisible && (
        <ClusterHistoricalUsageCsvModal
          afterDate={csvAfterDate}
          beforeDate={csvBeforeDate}
          onVisibleChange={setIsCsvModalVisible}
        />
      )}
    </>
  );
};

export default ClusterHistoricalUsage;
