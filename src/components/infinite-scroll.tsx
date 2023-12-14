import React, { useState, useEffect, useRef } from 'react';

export type Joke = {
    "error": boolean,
    "category": string,
    "type": string,
    "setup": string,
    "delivery": string,
    "flags": {
        "nsfw": boolean,
        "religious": boolean,
        "political": boolean,
        "racist": boolean,
        "sexist": boolean,
        "explicit": boolean,
    },
    "id": number,
    "safe": boolean,
    "lang": string
}

const InfiniteScroll = () => {
    const [items, setItems] = useState<Joke[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [hasMore, setHasMore] = useState(true)
    const [page,setPage] = useState(0)

    const elementRef = useRef(null)

    const onIntersection = (entries: Array<any>) => {
        const firstEntry = entries[0]
        if(firstEntry.isIntersecting && hasMore){
            fetchMoreItems()
        }
    }

    const fetchMoreItems = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=twopart&amount=5`);
            const data = await response.json();
            if(data.jokes.length == 0){
                setHasMore(false)
            }
            else{
                setItems(prevItems => [...prevItems, ...data.jokes]);
                setPage(prevPage => prevPage + 1)
            }
        } catch (error: any) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        const observer = new IntersectionObserver(onIntersection)
        if(observer && elementRef.current){
            observer.observe(elementRef.current)
        }
        return () => {
            if(observer){
                observer.disconnect()
            }
        }

    }, []);

    const handleChange = () => {
        setItems(items.map( (item) => {
            return(
                {...item, setup: item.setup.concat(' changed!')}
            )
        }))
    }


    return (
        <div>
            <div style={{
                height: '400px',
                width: '80%',
                marginLeft: '10%',
                overflowY: 'scroll'
            }}>
                {items.map(item => {
                    if(item.setup || item.delivery)return (
                    <div>
                        <h2>{item.setup}</h2>
                        <h4>{item.delivery}</h4>
                    </div>
                    )})}
                    {error && <div>{error}</div>}
                    {hasMore && <div ref={elementRef} >Load more items</div>}
            </div>
            <button onClick={handleChange}>Change records</button>
        </div>
    )
};

export default InfiniteScroll;
