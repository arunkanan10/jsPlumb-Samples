#lcTree
##Description
- Renders a hierarchical tree with an optional list toggle and search box

##How to Run the Demo:
1. Clone this repository
2. Run `npm install`
3. Run `gulp dev` (**Note:** You will need to have *gulp* install globally ...i.e. `npm install -g gulp`)
4. Presto! You should see the demo launched in your default web browser.

#Data Model:
 <div class="alert alert-warning">
 This component takes a view model that should be instantiated via the implementing application. The data model should resemble the following specifications.
 </div>

##Tree Data Structure   
key | value | description
--- | --- | ---
`root` | _**@type array**_ of _**@type object**_ | array of hierarchical data

##Tree Node Data Structure   
key | value | description
--- | --- | ---
`children` | _**@type array**_ of _**@type object**_ | child nodes

## Example Data Model
```
{
    singleSelect: true,
    selectedNode: [],
    treeData: {},
    emptyText: 'Enter a Host Group Name',
    listOptions: {
      columnHeaders: ['Name', 'Description'],
      rowProperties: ['name', 'id']
    }
}
```

