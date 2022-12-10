import InputGroup from 'react-bootstrap/InputGroup';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { InfoCircleFill } from 'react-bootstrap-icons';

export default function PolicyTooltip() {
  return (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip>
          At least 1 uppercase<br />
          At least 1 lowercase<br />
          At least 1 number<br />
          At least 1 special symbol
        </Tooltip>
      }
    >
      {({ ref, ...triggerHandler }) => (
        <InputGroup.Text
          {...triggerHandler}
          ref={ref}
        >
          <InfoCircleFill />
        </InputGroup.Text>
      )}
    </OverlayTrigger>
  );
}
