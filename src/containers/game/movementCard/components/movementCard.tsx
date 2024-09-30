import './movementCard.css';

function selectCard(id:number) {
  switch (id) {
    case 1:
      return ("/mov1.svg");
      break;
    case 2:
      return ("/mov2.svg");
      break;
    case 3:
      return('/mov3.svg');
      break;
    case 4:
      return('/mov4.svg');
      break;
    case 5:
      return('/mov5.svg');
      break;
    case 6:
      return('/mov6.svg');
      break;
    case 7:
      return('/mov7.svg');
      break;    
    default:
      return('https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freeiconspng.com%2Fimages%2Ferror&psig=AOvVaw3ayy6Et6v2gavgMyjPa1MY&ust=1727659299850000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKDZ08j-5ogDFQAAAAAdAAAAABAE');
  }
}



export function MovementCard(id:number) {
  
  let source = selectCard(id);
  
  return (
      <img src={source} alt='carta de movimiento' id='imagen'/>
  );
}
