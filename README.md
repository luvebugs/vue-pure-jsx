# babel-plugin-jsx-vue-purecomponent

### Example

#### Input

```javascript
    export default props => {
        return <span></span>;
    }
```
### Output

```javascript
    export default {
        functional: true,
        render: function (h, props) {
            return <span></span>;
        }
    }
```

#### config

```javascript
    {
        plugins: [
            [require.resolve('../src/index2.js')]
        ]
    }
```