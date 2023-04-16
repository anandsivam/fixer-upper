
export default function Header() {
  return (<>
    <div className="row">
      <div className="col h1">
        <a href='/'>
          <img src='img/university-background.jpg' alt='' width={200} height={50} />
        </a>
        Welcome to Fixer-Upper Bookings
      </div>
    </div>
    <div className="row">
      <div className="col">
        <div 
          onClick={() => window.location.href='/list'} 
          style={{color: 'blue', textDecoration: 'underline', cursor: 'pointer'}}>
          List Bookings
        </div>
      </div>
      <div className="col">
        <div 
          onClick={() => window.location.href='/add'} 
          style={{color: 'blue', textDecoration: 'underline', cursor: 'pointer'}}>
          Create Booking
        </div>
      </div>
    </div>
  </>)
}
