import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Card } from '../Card/Card';
import { Loader } from '../Loader/Loader';


const GET_CHARACTERS =  gql`
  query characters($page: Int, $query: String) {
    characters (page: $page, filter: { name: $query }) {
      results {
        id
        name
        status
        species
        type
        gender
        image
        origin {
          id
          name
          dimension
        }
        location {
          id
          name
        }
        episode {
          id
          name
          air_date
          episode
        }
      }

      info {
        pages
        next
        prev
        count
      }
    }
  }
`;

export const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const { loading, error, data } = useQuery(
    GET_CHARACTERS,
    { variables: { page: page, query: searchQuery } }
  )

  const prev = data && data.characters.info.prev
  const next = data && data.characters.info.next

  useEffect(() => {
    setPage(1)
  }, [searchQuery])

  return (
    <>
      <header>

        <div style={{textAlign:"center"}} className='container'>
            <h1 style={{marginBottom:"8px", color:"#282c34"}}> Rick and Morty Wiki</h1>
          <form  onSubmit={(e) => (setSearchQuery(query), e.preventDefault())}>
            <input style={{borderTopLeftRadius:"5px",borderBottomLeftRadius:"5px"}} value={query} onChange={(e) => setQuery(e.target.value)} aria-label="search" placeholder='Search by name' />
            <input style={{borderTopRightRadius:"5px",borderBottomRightRadius:"5px"}} type="submit" value="Search" className='btn' /><br /><br />
            {(data && !error && !loading) &&
              <p style={{fontSize:"1.1rem",color:"yellowgreen"}}><b>{data.characters.info.count} characters were found </b></p>
            }
          </form>
        </div>
      </header>

      <main className='container'>
        <section className={`cards-wrapper ${error ? 'flex' : 'grid'}`}>
          {error ? <b>No matches for your query</b>
            : data && data.characters && data.characters.results.map(item => (
              item.id && <Card key={item.id} data={item} />
            ))}
        </section>

        <section className='load-more'>
          {loading ? <Loader />
            : !error && (
              <>
                {prev &&
                  <button style={{ marginRight: '15px' }} onClick={() => setPage(data.characters.info.prev)}>
                    {'< pev'}
                  </button>}
                {next &&
                  <button onClick={() => setPage(data.characters.info.next)}>
                    {'next >'}
                  </button>}
              </>
            )
          }
        </section>
      </main>
      
      <footer style = {{padding:"10px", margin:"10px",textAlign:"center"}}>
      <div textAlign="center" fontSize="13px" p="10px" shadow="sm">
    {`© ${new Date().getFullYear()}, developed by `}
    <span >
    
      Mohammad Jabed Hossain
 
    </span>
    .
  </div>
      </footer>
    </>
  )
}