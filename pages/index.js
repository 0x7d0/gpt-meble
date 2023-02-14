import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Input, Button, List } from 'antd';
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

        setResults(items.slice(0, 10));
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
    <div style={{ margin: '24px', maxWidth: '600px', width: '100%', marginLeft: 'auto', marginRight: 'auto' }}>
      <Input.Search
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for modern chair or glass table"
        enterButton={
          <Button type="primary" onClick={handleSearch}>
            Search
          </Button>
        }
        size="large"
        style={{ marginBottom: '24px' }}
      />
      {results.length > 0 && (
        <List
          itemLayout="vertical"
          size="large"
          dataSource={results}
          renderItem={(item) => (
            <List.Item
              key={item.link}
              extra={
                <img
                  width={272}
                  alt={item.title}
                  src={item.image}
                />
              }
            >
              <List.Item.Meta title={<a href={item.link} target="_blank">{item.title}</a>} />
              <div>{item.price}</div>
            </List.Item>
          )}
        />
      )}
    </div>
  );
}
