import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import avatar from '../avatar.png';

function AccountSection() {
  return (
    <Dropdown>
      <Image src={avatar} roundedCircle />
      {/* <Dropdown.Toggle className='btn_dropdown' id="dropdown-basic">
        
      </Dropdown.Toggle> */}

      {/* <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
      </Dropdown.Menu> */}
    </Dropdown>
  );
}

export default AccountSection;