declare module 'vue3-tree' {
  import { DefineComponent } from 'vue'
  
  export interface TreeNodeData {
    id?: string | number
    label?: string
    children?: TreeNodeData[]
    [key: string]: any
  }
  
  export interface TreeProps {
    data?: TreeNodeData[]
    multiple?: boolean
    showCheckbox?: boolean
    expandedKeys?: (string | number)[]
    checkedKeys?: (string | number)[]
    selectedKeys?: (string | number)[]
    accordion?: boolean
    indent?: number
    iconClass?: string
    expandClass?: string
    collapseClass?: string
    emptyText?: string
    render?: (data: TreeNodeData) => any
    allowDrag?: boolean
    allowDrop?: boolean
    draggable?: boolean
  }
  
  const Tree: DefineComponent<TreeProps>
  export default Tree
}