import React, { Fragment, useEffect, useState } from 'react';
import { animate, stagger } from 'motion';
import { BeatLoader } from 'react-spinners';

// import TheNewStackLogo from '../components/the-new-stack-logo';

const config = [
  {
    name: 'Nama Tamu',
    id: 'nama_tamu'
  },
  {
    name: 'Asal Tamu',
    id: 'asal_tamu'
  },
  {
    name: 'Jumlah Undangan',
    id: 'jumlah_undangan'
  },
  {
    name: 'Jumlah Datang',
    id: 'jumlah_datang'
  },
  {
    name: 'Jenis Tamu',
    id: 'jenis_tamu'
  }
];

const Page = () => {
  const [guestList, setGuestList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [vipData, setVIPData] = useState({});

  const [formData, setFormData] = useState({
    id: -1,
    nama_tamu: '',
    asal_tamu: '',
    jumlah_datang: '',
    jenis_tamu: '',
  });
  const handleSubmit = async (e) => {
    e.preventDefault();

    //  const handleClick = async (id) => {
    // setIsSubmitting(true);
    if (formData.asal_tamu != '' && formData.asal_tamu != undefined && formData.nama_tamu != '' && formData.nama_tamu != undefined) {

      setIsLoading(true);
      try {
        console.log(`form data ${JSON.stringify(formData)}`)

        const response = await fetch(`/api/create-vote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }).then((response) => {
          if (!response.ok) {
            throw Error();
          }
          return response.json();
        }).then((result) => {
          setIsLoading(false);
          setIsModalOpen(true);
          console.log(result);
        }).catch((error) => {
          setIsLoading(false);
          setIsModalOpen(true);
          console.log(error);
        });;
        // if (!response.ok) {
        //   throw new Error(response.statusText);
        // }
        // console.log(response.json());
        setIsLoading(false);
        setIsModalOpen(true);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
        // setIsSubmitting(false);
        // setError({
        //     error: true,
        //     message: error.message
        // });
      }
    }
    // +  };
  };

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/populate-data`).then((response) => {
      if (!response.ok) {
        throw Error();
      }
      return response.json();
    }).then((result) => {
      setIsLoading(false);
      console.log('jumlah tamu')
      console.log(result.data);
      setGuestList(result.data);
    }).catch((error) => {
      setIsLoading(false);
      console.log(error);
    });
  }, []);

  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e) => {
    console.log('input typed');
    const inputValue = e.target.value;
    setFormData({ nama_tamu: inputValue, asal_tamu: '', jumlah_datang: '', jenis_tamu: '' });
    if (inputValue != '') {
      const newSuggestions = getSuggestions(inputValue);
      setSuggestions(newSuggestions);
      console.log(suggestions);
    } else {
      setSuggestions([]);
    }
  };

  const getSuggestions = (inputValue) => {
    const data = guestList?.filter((suggestion) => {
      if (suggestion[1] != undefined) {
        return suggestion[1].toLowerCase().includes(inputValue.toLowerCase());
      }
    });

    return data;
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion && suggestion[suggestion.length - 1] != undefined) {
      if (suggestion[suggestion.length - 1] == 'vip') {
        setVIPData(suggestion);
        console.log(vipData);
      } else {
        setVIPData({});
      }
      setFormData({ id: suggestion[0], nama_tamu: suggestion[1], asal_tamu: suggestion[2], jenis_tamu: suggestion[suggestion.length - 1] });
    }
    setSuggestions([]);
  };

  return (
    <div className='container'>
      <h1>Selamat Datang di Pernikahan</h1>
      <h3 className="groomBride">Destanti & Fahmi</h3>
      {/* <h2>Destanti & Fahmi</h2> */}
      <form onSubmit={handleSubmit}>
        <div className="inputContainer">
          <label className="inputLabel" htmlFor="name">
            Nama :
          </label>
          <input
            type="text"
            id="name"
            value={formData.nama_tamu}
            onChange={handleInputChange}
            className="inputField"
          />
          {suggestions.length > 0 && (
            <ul>
              {suggestions.map((suggestion, index) => (
                <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                  {suggestion[1]}
                </li>
              ))}
            </ul>)}
        </div>
        <div className="inputContainer">
          <label className="inputLabel" htmlFor="from" >
            Asal :
          </label>
          <input
            type="text"
            name="from"
            value={formData.asal_tamu}
            className="inputField"
            onChange={(e) => setFormData({ ...formData, asal_tamu: e.target.value })} />
        </div>
        <div className="inputContainer">
          <label className="inputLabel" htmlFor="numberOfGuests">
            Jumlah Tamu:
          </label>
          <input
            type="number"
            id="numberOfGuests"
            value={formData.jumlah_datang}
            className="inputField"
            onChange={(e) =>
              setFormData({
                ...formData,
                jumlah_datang: parseInt(e.target.value) || 1,
              })
            } />
        </div>
        {/* <div className="nameContainer">
          <label htmlFor="name">Nama</label>
          <input
            type="text"
            id="name"
            value={formData.nama_tamu}
            onChange={handleInputChange}
          />
          {suggestions.length > 0 && (
            <ul className="suggestion-list">
              {suggestions.map((suggestion, index) => (
                <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                  {suggestion[1]}
                </li>
              ))}
            </ul>
          )}
        </div> */}
        {/* <div>
          <label htmlFor="from">From:</label>
          <input
            type="text"
            id="from"
            value={formData.asal_tamu}
            onChange={(e) => setFormData({ ...formData, asal_tamu: e.target.value })}
          />
        </div> */}
        {/* <div>
          <label htmlFor="numberOfGuests">Number of Guests:</label>
          <input
            type="number"
            id="numberOfGuests"
            value={formData.jumlah_datang}
            onChange={(e) =>
              setFormData({
                ...formData,
                jumlah_datang: parseInt(e.target.value) || 1,
              })
            }
          />
        </div> */}
        <button type="submit" className='submitButton'>Isi Daftar Hadir</button>
      </form>

      {isLoading && (
        <div className="loading-modal">
          <div className="loading-content">
            <BeatLoader color="#0070f3" loading={true} size={20} />
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            {vipData.length && vipData[1] != undefined > 0 ? (
              <h2>{`Terima Kasih, Bapak ${vipData[1]}`} </h2>
            ) : <h2>Terima Kasih</h2>}
            <p>Tunjukkan bukti isi tamu ini untuk mendapatkan kupon Souvenir :)</p>
            <button onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
<style jsx global>{`
  html,
  body {
    padding: 0;
    margin: 0;
    font-family: Handlee;
  }

  * {
    box-sizing: border-box;
  }
`}</style>