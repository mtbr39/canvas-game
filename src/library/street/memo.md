

### 辺が作成できなかった原因

NG
`graph.addVertex(vertex1);`の使い方が誤り
```js
    const graph = new UndirectedPathGraph();
    let vertex1 = new PathVertex({x:100, y:100});
    let vertex2 = new PathVertex({x:200, y:100});
    graph.addVertex(vertex1);
    graph.addVertex(vertex2);
    graph.addEdge(vertex1, vertex2);
```

OK
```js
    const graph = new UndirectedPathGraph();
    let vertex1 = graph.addVertex({x:100, y:100});
    let vertex2 = graph.addVertex({x:200, y:100});
    graph.addEdge(vertex1, vertex2);
```


### pathMoving

pathが[]でもtrueになってたから`&& path.length>0`を追加した
```js
    walk(path) {
        if (path && path.length>0) {
            ...

            return true;
        } else {
            return false;
        }
    }
```