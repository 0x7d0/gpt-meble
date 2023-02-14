import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import cheerio from 'cheerio';

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();

    if (query) {
      axios.get(`https://www.google.com/search?q=${query}`).then((response) => {
        const $ = cheerio.load(response.data);
        const items = [];

        $('.g').each((i, el) => {
          const $el = $(el);
          const title = $el.find('h3').text();
          const link = $el.find('a').attr('href');
          const image = $el.find('img').attr('src');
          const price = $el.find('.a-price-whole').text() || 'N/A';

          if (title && link && image) {
            items.push({ title, link, image, price });
          }
        });

        setResults(items);
        router.push(`/?q=${query}`);
      });
    }
  };

  useEffect(() => {
    const searchQuery = router.query.q;

    if (searchQuery) {
      setQuery(searchQuery);
      handleSearch();
    }
  }, []);

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button type="submit">Search</button>
      </form>
      {results.length > 0 && (
        <ul>
          {results.map((item) => (
            <li key={item.link}>
              <a href={item.link} target="_blank">
                <img src={item.image} alt={item.title} />
                <h3>{item.title}</h3>
                <p>{item.price}</p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
