import { DatePicker, Form, Modal } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React from 'react';

interface Props {
  afterDate: Dayjs,
  beforeDate: Dayjs,
  onVisibleChange: (visible: boolean) => void;
}

const ClusterHistoricalUsageCsvModal: React.FC<Props> = (
  { afterDate, beforeDate, onVisibleChange }: Props,
) => {
  const [ form ] = Form.useForm();

  const formAfterDate = form.getFieldValue('afterDate');
  const formBeforeDate = form.getFieldValue('beforeDate');

  const handleOk = (): void => {
    // todo: call API + download CSV
    onVisibleChange(false);
  };

  const isAfterDateDisabled = (currentDate: Dayjs) => {
    return currentDate.isAfter(formBeforeDate);
  };

  const isBeforeDateDisabled = (currentDate: Dayjs) => {
    return currentDate.isBefore(formAfterDate) || currentDate.isAfter(dayjs());
  };

  return <Modal
    okText='Proceed to Download'
    title='Download Resource Usage Data in CSV'
    visible={true}
    onCancel={() => onVisibleChange(false)}
    onOk={handleOk}
  >
    <Form
      form={form}
      initialValues={{ afterDate, beforeDate }}
    >
      <Form.Item label="Start" name="afterDate">
        <DatePicker
          allowClear={false}
          disabledDate={isAfterDateDisabled}
          style={{ minWidth: '150px' }}
        />
      </Form.Item>

      <Form.Item label="End" name="beforeDate">
        <DatePicker
          allowClear={false}
          disabledDate={isBeforeDateDisabled}
          style={{ minWidth: '150px' }}
        />
      </Form.Item>
    </Form>
  </Modal>;
};

export default ClusterHistoricalUsageCsvModal;
