declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Vue internal types
declare const __VLS_WithComponent: any
declare const __VLS_intrinsicElements: any
declare const __VLS_elementAsFunctionalComponent: any
declare const __VLS_functionalComponentArgsRest: any
declare const __VLS_FunctionalComponentProps: any
declare const __VLS_pickFunctionalComponentCtx: any 