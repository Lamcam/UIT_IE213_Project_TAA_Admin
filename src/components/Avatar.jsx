import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import avatar from '../avatar.png';

function AccountSection() {
  const handleLogout = async () => {
    localStorage.removeItem('admin');
    localStorage.setItem('error', "");
    window.location.href = '/';
  }
  return (
    <Dropdown>
      
      <Dropdown.Toggle className='btn_dropdown' id="dropdown-basic">
        <Image src={avatar} roundedCircle />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item className='logout-btn' onClick={handleLogout} > Đăng xuất</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default AccountSection;