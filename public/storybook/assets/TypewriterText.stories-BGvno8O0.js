import{j as e}from"./jsx-runtime-DoEZbXM1.js";import"./jsx-runtime-Bw5QeaCk.js";function y({text:d,style:x}){return e.jsxs("h1",{className:"text-6xl font-bold text-white flex items-center justify-center",children:[e.jsx("span",{children:"Hello,"}),e.jsxs("div",{className:"relative flex items-center ml-3",children:[e.jsx("span",{style:x,className:"mr-1",children:d}),e.jsx("span",{className:"animate-[blink_1s_steps(1)_infinite] text-white",children:"|"})]})]})}y.__docgenInfo={description:`타이핑 효과가 있는 텍스트 컴포넌트\r
- "Hello," 텍스트와 함께 동적으로 변하는 텍스트 표시\r
- 커서 깜빡임 애니메이션 효과 포함`,methods:[],displayName:"TypewriterText",props:{text:{required:!0,tsType:{name:"string"},description:""},style:{required:!0,tsType:{name:"signature",type:"object",raw:`{\r
  color: string;\r
  fontFamily: string;\r
}`,signature:{properties:[{key:"color",value:{name:"string",required:!0}},{key:"fontFamily",value:{name:"string",required:!0}}]}},description:""}}};const F={title:"stories/components/home/TypewriterText",component:y,parameters:{layout:"centered",backgrounds:{default:"dark"}},argTypes:{text:{control:"text"},style:{control:"object"}}},t={args:{text:"I am Van",style:{color:"#3B82F6",fontFamily:"monospace"}}},r={args:{text:"I am Developer",style:{color:"#10B981",fontFamily:"system-ui"}}},s={args:{text:"Welcome!",style:{color:"#8B5CF6",fontFamily:"cursive"}}};var n,o,a;t.parameters={...t.parameters,docs:{...(n=t.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    text: 'I am Van',
    style: {
      color: '#3B82F6',
      // blue-500
      fontFamily: 'monospace'
    }
  }
}`,...(a=(o=t.parameters)==null?void 0:o.docs)==null?void 0:a.source}}};var l,i,c;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    text: 'I am Developer',
    style: {
      color: '#10B981',
      // green-500
      fontFamily: 'system-ui'
    }
  }
}`,...(c=(i=r.parameters)==null?void 0:i.docs)==null?void 0:c.source}}};var m,p,u;s.parameters={...s.parameters,docs:{...(m=s.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    text: 'Welcome!',
    style: {
      color: '#8B5CF6',
      // purple-500
      fontFamily: 'cursive'
    }
  }
}`,...(u=(p=s.parameters)==null?void 0:p.docs)==null?void 0:u.source}}};const h=["DefaultStyle","GreenStyle","PurpleStyle"];export{t as DefaultStyle,r as GreenStyle,s as PurpleStyle,h as __namedExportsOrder,F as default};
