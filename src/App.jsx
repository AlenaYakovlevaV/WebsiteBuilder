import React from 'react';
import './App.scss';

function App() {
  const startImg = 'https://cleancharm.ru/assets/img/nophoto.png';
  const [reset, setReset] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);  
  const [edit, setEdit] = React.useState(true);
  const [mode, setMode] = React.useState(edit);
  const [titles, setTitles] = React.useState([]);
  const [films, setFilms] = React.useState([]);
  const [currentSection, setCurrentSection] = React.useState(null)

  let titlesFromStorage = JSON.parse(localStorage.getItem('titles'));

  // Запись в локальное хранилище при изменении секций
  React.useEffect(() => {
    localStorage.setItem('titles', JSON.stringify(titles));
    console.log(titles);
  }, [titles])

  //Сброс изменений страницы
  React.useEffect(() => {
    setTitles(titlesFromStorage === null ?
      [
        {id: 1, order: 1, key: 'Заголовок', title: 'Заголовок'},
        {id: 2, order: 2, key: 'Карточки', 
        cards: [
          {label: 'Карточка', description: 'Описание карточки', image: startImg, color: '#000000', backgroundColor: '#ffffff'},
          {label: 'Карточка', description: 'Описание карточки', image: startImg, color: '#000000', backgroundColor: '#ffffff'},
          {label: 'Карточка', description: 'Описание карточки', image: startImg, color: '#000000', backgroundColor: '#ffffff'},
          {label: 'Карточка', description: 'Описание карточки', image: startImg, color: '#000000', backgroundColor: '#ffffff'},
        ]
      }
        
      ]
      : titlesFromStorage)
  }, [reset])

  //Получение массива фильмов
  React.useEffect(() => {
    setIsLoading(true)
    fetch("https://64f0e4498a8b66ecf77a380d.mockapi.io/films")
    .then(res => res.json())
    .then((json) => {
      setFilms(json)
    })
    .catch((err) => {
      console.warn(err);
      alert('Ошибка получения данных');
    })
    .finally(() => setIsLoading(false))
  }, [])

  function dragStartHandler(e, section) {
    setCurrentSection(section);
  }

  function dragOverHandler(e) {
    e.preventDefault();
  }

  function dropHandler(e, section) {
    e.preventDefault();
    setTitles(titles.map(s => {
      if (s.id === section.id) {
        console.log('s.id', s.id);
        console.log('section.id', section.id);
        return {...s, order: currentSection.order}
      }
      if (s.id === currentSection.id) {
        console.log('s.id', s.id);
        console.log('currentSection.id', section.id);
        return {...s, order: section.order}
      }

      return s;
    }))
    console.log('drop', section);
  }

  const sortSections = (a, b) => {
    if (a.order >= b.order) {
      return 1;
    } else {
      return -1;
    }
  }

  return (
    <div className="App">
      <header className='header'>
        <div className='header-right'>
          <h1>Конструктор сайта</h1>
        </div>
        <div className='header-left'>
          <button className='btn btn-mode' onClick={() => {setMode(true); setEdit(true)}}>Edit</button>
          <button className='btn btn-mode' onClick={() => {setMode(false); setEdit(false)}}>View</button>
          <button className='btn btn-mode' onClick={() => {setReset(true); window.localStorage.clear(); window.location.reload()}}>Reset</button>
        </div>
      </header>
      <main className={mode ? 'main' : 'main view-style'}>
        <div 
          className='site'
        >
          <div>
            {titles.sort(sortSections).map((title, index) => 
              <div
                onDragStart={(e) => dragStartHandler(e, title)}
                onDragOver={(e) => dragOverHandler(e)}
                onDrop={(e) => dropHandler(e, title)} 
                draggable={true}
                key={index}
              >
              {title.key === 'Заголовок' ? 
                  <div key={index} className='section-title'>
                    
                    <div className='title'>
                      <h1 
                        className='section-title__title'
                        contentEditable = {edit}
                        onClick={(e) => {
                          let titleS = document.querySelectorAll('.section-title__title')[index].innerHTML;
                          let arr = [...titles];
                          arr[index].title = titleS;
                          setTitles(arr);
                        }}
                      >{title.title}</h1>
                    </div>
                    <button 
                       onClick={() =>
                        {
                          setTitles(titles.filter((e, i) => {return index !== i}))
                        }
                       }
                      className='delete'>-</button>
                  </div>
                : title.key === 'Карточки' ? 
                <div key={index}>
                <div className='section-cards'>
                  <div className='btn-actions'>
                    <button 
                      onClick={() => {
                        const newElement = {label: 'Карточка', description: 'Описание карточки', image: startImg, color: '#000000', backgroundColor: '#ffffff'}
                        let ntitles = [...titles];
                        ntitles[index].cards.push(newElement);
                        setTitles(ntitles);
                      }}
                      className='add'>+</button>
                    <button
                      onClick={() =>
                        {
                          setTitles(titles.filter((e, i) => {return index !== i}))
                        }
                       }
                      className='delete'>-</button> 
                  </div>
                  <div>
                    <ul className='cards__list'>
                    {
                      title.cards.map((card, i) => {
                        return <li key={i}>
                          <div className='card' style={{backgroundColor: card.backgroundColor, color: card.color}}>
                            <div className='btn-card'>
                              <button
                               onClick={() =>
                                {
                                  let ntitles = [...titles];
                                  ntitles[index].cards.splice(i, 1);
                                  setTitles(ntitles);
                                }
                               }
                               className='delete'>-</button>
                            <input 
                              title='Цвет фона'
                              className='color'
                              type="color" 
                              value={card.backgroundColor}
                              onChange={(e) => {
                                let arr = [...titles];
                                arr[index].cards[i].backgroundColor = e.target.value;
                                setTitles(arr);
                              }}
                              />                                 
                            <input 
                              title='Цвет текста'
                              className='color'
                              type="color" 
                              value={card.color}
                              onChange={(e) => {
                                let arr = [...titles];
                                arr[index].cards[i].color = e.target.value;
                                setTitles(arr);
                              }}
                              />
                            </div>
                            <h2 
                              className='card__title'
                              contentEditable = {edit}
                              onClick={(e) => {
                                let label = document.querySelectorAll('.card__title')[i].innerHTML;
                                let arr = [...titles];
                                arr[index].cards[i].label = label;
                                setTitles(arr);
                              }}
                            >{card.label}</h2>
                            <p 
                              contentEditable = {edit}
                              className='description'
                              title={card.description}
                              onClick={(e) => {
                                let descr = document.querySelectorAll('.description')[i].innerHTML;
                                let arr = [...titles];
                                arr[index].cards[i].description = descr;
                                setTitles(arr);
                              }}
                              >
                                {card.description}
                            </p>
                            <div className='image'>
                              <img src={card.image} alt="img" />
                              <input type='file' 
                              onChange={(e) => {
                                titles[index].cards[i].image = e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : card.image
                              }} />
                            </div>
                          </div>
                        </li>
                      })
                    }
                    </ul>  
                  </div>
                </div>
              </div>   
                : title.key === 'Фильмы' ?
                <div key={index}>
                <div className='section-films'>
                  {isLoading ? <p>Loading ...</p> :
                  <ul className='films__list'>
                    {films.map((film, j) => {
                      return (
                        <li key={j}>
                          <div>
                            <div className='films-top'>
                              <div className='films-left'>
                                <img src={film.capture} alt='Обложка фильма' />
                              </div>
                              <div className='films-right'>
                                <h2>{film.name}</h2>
                                <p>Описание фильма: {film.description}</p>
                              </div>
                            </div>
                            <div className='films-bottom'>
                              <span className='raiting'>Рейтинг: {film.rating}</span>
                              <span>Год выхода: {film.year}</span>
                            </div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>}
                </div>
              </div>
                : ''
              }
            </div>)}
          </div>
        </div>
        <div className='elements'>
          <button onClick={() => setTitles([...titles, {id: titles.length+3, order: titles.length+4, key:'Заголовок', title: 'Заголовок'}])} className='btn btn-add'>Заголовок</button>
          <button onClick={() => setTitles([...titles, {id: titles.length+3, order: titles.length+4, key: 'Карточки', 
      cards: [
        {label: 'Карточка', description: 'Описание карточки', image: startImg, color: '#000000', backgroundColor: '#ffffff'},
        {label: 'Карточка', description: 'Описание карточки', image: startImg, color: '#000000', backgroundColor: '#ffffff'},
        {label: 'Карточка', description: 'Описание карточки', image: startImg, color: '#000000', backgroundColor: '#ffffff'},
        {label: 'Карточка', description: 'Описание карточки', image: startImg, color: '#000000', backgroundColor: '#ffffff'},
      ]
    }])} className='btn btn-add'>Карточки</button>
          <button onClick={() => setTitles([...titles, {id: titles.length+3, order: titles.length+4, key: 'Фильмы'}])} className='btn btn-add'>Фильмы</button>
        </div>
      </main>
    </div>
  );
}

export default App;
