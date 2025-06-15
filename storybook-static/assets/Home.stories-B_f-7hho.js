import{j as e,a as t}from"./iframe-JTgUOfHV.js";import{a as pe,b as T}from"./index-DDGduCHk.js";import{G as g,u as xe}from"./i18n-DtTisMBQ.js";import{e as he}from"./index-y5QHQkV5.js";function u(){return e.jsxs("video",{autoPlay:!0,loop:!0,muted:!0,playsInline:!0,className:"absolute top-0 left-0 w-full h-full object-cover z-0",style:{backgroundColor:"#1a1a1a"},children:[e.jsx("source",{src:"/Home_background.webm",type:"video/webm"}),e.jsx("source",{src:"/Home_background.mp4",type:"video/mp4"})]})}u.__docgenInfo={description:`홈페이지 배경 비디오 컴포넌트\r
- 자동 재생 및 무한 반복\r
- 음소거 상태로 재생\r
- 모바일 환경에서도 인라인 재생 지원\r
- 전체 화면을 커버하도록 설정`,methods:[],displayName:"BackgroundVideo"};function b({title:r="Van's Dev Blog",className:s=""}){return e.jsxs("div",{className:`relative bg-transparent border-2 border-white text-white px-6 py-2 rounded-full inline-block ${s}`,children:[r,e.jsx("div",{className:"absolute left-1/2 w-0 h-0",style:{transform:"translateX(-50%)",bottom:"-10px",borderLeft:"10px solid transparent",borderRight:"10px solid transparent",borderTop:"10px solid white"}})]})}b.__docgenInfo={description:"",methods:[],displayName:"BlogTitle",props:{title:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:`"Van's Dev Blog"`,computed:!1}},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'""',computed:!1}}}};function k({text:r,style:s}){return e.jsxs("h1",{className:"text-6xl font-bold text-white flex items-center justify-center",children:[e.jsx("span",{children:"Hello,"}),e.jsxs("div",{className:"relative flex items-center ml-3",children:[e.jsx("span",{style:s,className:"mr-1",children:r}),e.jsx("span",{className:"animate-[blink_1s_steps(1)_infinite] text-white",children:"|"})]})]})}k.__docgenInfo={description:`타이핑 효과가 있는 텍스트 컴포넌트\r
- "Hello," 텍스트와 함께 동적으로 변하는 텍스트 표시\r
- 커서 깜빡임 애니메이션 효과 포함`,methods:[],displayName:"TypewriterText",props:{text:{required:!0,tsType:{name:"string"},description:""},style:{required:!0,tsType:{name:"signature",type:"object",raw:`{\r
  color: string;\r
  fontFamily: string;\r
}`,signature:{properties:[{key:"color",value:{name:"string",required:!0}},{key:"fontFamily",value:{name:"string",required:!0}}]}},description:""}}};const ge="_bgGridPattern_11flo_7",ue={bgGridPattern:ge};function be(r){return g({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{d:"M418.2 177.2c-5.4-1.8-10.8-3.5-16.2-5.1.9-3.7 1.7-7.4 2.5-11.1 12.3-59.6 4.2-107.5-23.1-123.3-26.3-15.1-69.2.6-112.6 38.4-4.3 3.7-8.5 7.6-12.5 11.5-2.7-2.6-5.5-5.2-8.3-7.7-45.5-40.4-91.1-57.4-118.4-41.5-26.2 15.2-34 60.3-23 116.7 1.1 5.6 2.3 11.1 3.7 16.7-6.4 1.8-12.7 3.8-18.6 5.9C38.3 196.2 0 225.4 0 255.6c0 31.2 40.8 62.5 96.3 81.5 4.5 1.5 9 3 13.6 4.3-1.5 6-2.8 11.9-4 18-10.5 55.5-2.3 99.5 23.9 114.6 27 15.6 72.4-.4 116.6-39.1 3.5-3.1 7-6.3 10.5-9.7 4.4 4.3 9 8.4 13.6 12.4 42.8 36.8 85.1 51.7 111.2 36.6 27-15.6 35.8-62.9 24.4-120.5-.9-4.4-1.9-8.9-3-13.5 3.2-.9 6.3-1.9 9.4-2.9 57.7-19.1 99.5-50 99.5-81.7 0-30.3-39.4-59.7-93.8-78.4zM282.9 92.3c37.2-32.4 71.9-45.1 87.7-36 16.9 9.7 23.4 48.9 12.8 100.4-.7 3.4-1.4 6.7-2.3 10-22.2-5-44.7-8.6-67.3-10.6-13-18.6-27.2-36.4-42.6-53.1 3.9-3.7 7.7-7.2 11.7-10.7zM167.2 307.5c5.1 8.7 10.3 17.4 15.8 25.9-15.6-1.7-31.1-4.2-46.4-7.5 4.4-14.4 9.9-29.3 16.3-44.5 4.6 8.8 9.3 17.5 14.3 26.1zm-30.3-120.3c14.4-3.2 29.7-5.8 45.6-7.8-5.3 8.3-10.5 16.8-15.4 25.4-4.9 8.5-9.7 17.2-14.2 26-6.3-14.9-11.6-29.5-16-43.6zm27.4 68.9c6.6-13.8 13.8-27.3 21.4-40.6s15.8-26.2 24.4-38.9c15-1.1 30.3-1.7 45.9-1.7s31 .6 45.9 1.7c8.5 12.6 16.6 25.5 24.3 38.7s14.9 26.7 21.7 40.4c-6.7 13.8-13.9 27.4-21.6 40.8-7.6 13.3-15.7 26.2-24.2 39-14.9 1.1-30.4 1.6-46.1 1.6s-30.9-.5-45.6-1.4c-8.7-12.7-16.9-25.7-24.6-39s-14.8-26.8-21.5-40.6zm180.6 51.2c5.1-8.8 9.9-17.7 14.6-26.7 6.4 14.5 12 29.2 16.9 44.3-15.5 3.5-31.2 6.2-47 8 5.4-8.4 10.5-17 15.5-25.6zm14.4-76.5c-4.7-8.8-9.5-17.6-14.5-26.2-4.9-8.5-10-16.9-15.3-25.2 16.1 2 31.5 4.7 45.9 8-4.6 14.8-10 29.2-16.1 43.4zM256.2 118.3c10.5 11.4 20.4 23.4 29.6 35.8-19.8-.9-39.7-.9-59.5 0 9.8-12.9 19.9-24.9 29.9-35.8zM140.2 57c16.8-9.8 54.1 4.2 93.4 39 2.5 2.2 5 4.6 7.6 7-15.5 16.7-29.8 34.5-42.9 53.1-22.6 2-45 5.5-67.2 10.4-1.3-5.1-2.4-10.3-3.5-15.5-9.4-48.4-3.2-84.9 12.6-94zm-24.5 263.6c-4.2-1.2-8.3-2.5-12.4-3.9-21.3-6.7-45.5-17.3-63-31.2-10.1-7-16.9-17.8-18.8-29.9 0-18.3 31.6-41.7 77.2-57.6 5.7-2 11.5-3.8 17.3-5.5 6.8 21.7 15 43 24.5 63.6-9.6 20.9-17.9 42.5-24.8 64.5zm116.6 98c-16.5 15.1-35.6 27.1-56.4 35.3-11.1 5.3-23.9 5.8-35.3 1.3-15.9-9.2-22.5-44.5-13.5-92 1.1-5.6 2.3-11.2 3.7-16.7 22.4 4.8 45 8.1 67.9 9.8 13.2 18.7 27.7 36.6 43.2 53.4-3.2 3.1-6.4 6.1-9.6 8.9zm24.5-24.3c-10.2-11-20.4-23.2-30.3-36.3 9.6.4 19.5.6 29.5.6 10.3 0 20.4-.2 30.4-.7-9.2 12.7-19.1 24.8-29.6 36.4zm130.7 30c-.9 12.2-6.9 23.6-16.5 31.3-15.9 9.2-49.8-2.8-86.4-34.2-4.2-3.6-8.4-7.5-12.7-11.5 15.3-16.9 29.4-34.8 42.2-53.6 22.9-1.9 45.7-5.4 68.2-10.5 1 4.1 1.9 8.2 2.7 12.2 4.9 21.6 5.7 44.1 2.5 66.3zm18.2-107.5c-2.8.9-5.6 1.8-8.5 2.6-7-21.8-15.6-43.1-25.5-63.8 9.6-20.4 17.7-41.4 24.5-62.9 5.2 1.5 10.2 3.1 15 4.7 46.6 16 79.3 39.8 79.3 58 0 19.6-34.9 44.9-84.8 61.4zm-149.7-15c25.3 0 45.8-20.5 45.8-45.8s-20.5-45.8-45.8-45.8c-25.3 0-45.8 20.5-45.8 45.8s20.5 45.8 45.8 45.8z"},child:[]}]})(r)}function fe(r){return g({attr:{viewBox:"0 0 640 512"},child:[{tag:"path",attr:{d:"M255.03 261.65c6.25 6.25 16.38 6.25 22.63 0l11.31-11.31c6.25-6.25 6.25-16.38 0-22.63L253.25 192l35.71-35.72c6.25-6.25 6.25-16.38 0-22.63l-11.31-11.31c-6.25-6.25-16.38-6.25-22.63 0l-58.34 58.34c-6.25 6.25-6.25 16.38 0 22.63l58.35 58.34zm96.01-11.3l11.31 11.31c6.25 6.25 16.38 6.25 22.63 0l58.34-58.34c6.25-6.25 6.25-16.38 0-22.63l-58.34-58.34c-6.25-6.25-16.38-6.25-22.63 0l-11.31 11.31c-6.25 6.25-6.25 16.38 0 22.63L386.75 192l-35.71 35.72c-6.25 6.25-6.25 16.38 0 22.63zM624 416H381.54c-.74 19.81-14.71 32-32.74 32H288c-18.69 0-33.02-17.47-32.77-32H16c-8.8 0-16 7.2-16 16v16c0 35.2 28.8 64 64 64h512c35.2 0 64-28.8 64-64v-16c0-8.8-7.2-16-16-16zM576 48c0-26.4-21.6-48-48-48H112C85.6 0 64 21.6 64 48v336h512V48zm-64 272H128V64h384v256z"},child:[]}]})(r)}function ve(r){return g({attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"path",attr:{d:"M9 15v-6l7.745 10.65a9 9 0 1 1 2.255 -1.993"},child:[]},{tag:"path",attr:{d:"M15 12v-3"},child:[]}]})(r)}function ye(r){return g({attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{d:"M20 3H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM4 9V5h16v4zm16 4H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2zM4 19v-4h16v4z"},child:[]},{tag:"path",attr:{d:"M17 6h2v2h-2zm-3 0h2v2h-2zm3 10h2v2h-2zm-3 0h2v2h-2z"},child:[]}]})(r)}function f(){const{t:r}=xe(),[s,p]=t.useState(!1);if(t.useEffect(()=>{p(!0)},[]),!s)return null;const x=[{name:"Frontend",icon:e.jsx(fe,{className:"text-blue-400"})},{name:"Backend",icon:e.jsx(ye,{className:"text-gray-400"})},{name:"React",icon:e.jsx(be,{className:"text-blue-400"})},{name:"Next.js",icon:e.jsx(ve,{className:"text-white"})},{name:"Spring Boot",icon:e.jsx(he,{className:"text-green-400"})}];return e.jsxs("section",{className:"relative bg-gray-900 w-full py-16",children:[e.jsx("div",{className:`absolute inset-0 ${ue.bgGridPattern} opacity-[0.05]`}),e.jsx("div",{className:"container mx-auto px-4 relative z-10",children:e.jsxs("div",{className:"max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-8",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-8",children:[e.jsx("div",{className:"w-8 h-[2px] bg-blue-400"}),e.jsx("h2",{className:"text-2xl font-bold text-white",children:r("home.blogIntro")})]}),e.jsxs("div",{className:"text-lg leading-relaxed space-y-6 text-gray-300",children:[e.jsxs("p",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"animate-wave inline-block origin-[70%_70%]",children:"👋"}),r("home.welcome")]}),e.jsxs("div",{className:"pl-6 border-l-2 border-gray-600",children:[e.jsx("p",{className:"mb-4",children:r("home.techIntro")}),e.jsx("div",{className:"flex flex-wrap gap-2",children:x.map(a=>e.jsxs("span",{className:"px-3 py-1 bg-gray-700 text-sm rounded-full text-gray-200 flex items-center gap-1 border border-gray-600 hover:bg-gray-600 transition-colors",children:[a.icon,a.name]},a.name))})]}),e.jsx("p",{className:"text-right italic text-gray-400",children:r("home.expectation")})]})]})})]})}f.__docgenInfo={description:"",methods:[],displayName:"MainContent"};const j=["#34D399","#F472B6","#A78BFA","#FBBF24","#60A5FA"],w=["monospace","serif","Helvetica","Arial"];function Ne(r){const[s,p]=t.useState(""),[x,a]=t.useState(0),[y,z]=t.useState(!1),[ce,le]=t.useState({text:"",style:{color:j[0],fontFamily:w[0]}}),de=N=>({text:N,style:{color:j[Math.floor(Math.random()*j.length)],fontFamily:w[Math.floor(Math.random()*w.length)]}});return t.useEffect(()=>{const N=setTimeout(()=>{const h=r[x];y?(p(h.substring(0,s.length-1)),s===""&&(z(!1),a(me=>(me+1)%r.length))):(p(h.substring(0,s.length+1)),s===""&&le(de(h)),s===h&&(z(!0),setTimeout(()=>{},2e3)))},y?100:150);return()=>clearTimeout(N)},[s,x,y,r]),{text:s,style:ce.style}}function v(){const{text:r,style:s}=Ne(["World!","Developer!","Everyone!"]);return e.jsx("div",{className:"w-full",children:e.jsx(k,{text:r,style:s})})}v.__docgenInfo={description:"",methods:[],displayName:"TypewriterSection"};const ze={title:"Features/Home",decorators:[pe],parameters:{docs:{description:{component:"홈 페이지를 구성하는 주요 컴포넌트들의 갤러리입니다. 각 컴포넌트는 사용자에게 강력한 첫인상을 제공합니다."}}}},n={render:()=>e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"h-[65vh] relative overflow-hidden w-full",children:[e.jsx(u,{}),e.jsx("div",{className:"absolute inset-0 bg-black/30",children:e.jsxs("div",{className:"container mx-auto w-full px-4 h-full flex flex-col items-center justify-center space-y-12 text-center",children:[e.jsx(b,{}),e.jsx(v,{})]})})]}),e.jsx(f,{})]}),decorators:[T],parameters:{docs:{description:{story:"완전한 홈 페이지 컴포넌트입니다. 비디오 배경, 타이틀, 타이핑 효과, 기술 스택 소개가 모두 포함되어 있습니다."}}}},o={render:()=>e.jsx("div",{className:"space-y-8 bg-gray-50 min-h-screen p-4",children:e.jsxs("div",{className:"bg-white rounded-lg shadow-sm overflow-hidden",children:[e.jsxs("div",{className:"p-4 bg-gray-100 border-b",children:[e.jsx("h3",{className:"font-semibold text-gray-700",children:"배경 비디오"}),e.jsx("p",{className:"text-sm text-gray-500",children:"자동 재생 풀스크린 배경"})]}),e.jsxs("div",{className:"relative h-64",children:[e.jsx(u,{}),e.jsx("div",{className:"absolute inset-0 bg-black/30 flex items-center justify-center",children:e.jsx("p",{className:"text-white font-semibold",children:"배경 비디오 재생 중"})})]})]})}),decorators:[T],parameters:{docs:{description:{story:"홈 페이지의 배경 비디오 컴포넌트입니다. 자동 재생되며 전체 화면을 자연스럽게 채웁니다."}}}},i={name:"블로그 타이틀",render:()=>e.jsx("div",{className:"h-64 bg-black flex items-center justify-center",children:e.jsx(b,{})}),parameters:{docs:{description:{story:"블로그 타이틀 컴포넌트입니다. 둥근 테두리와 하단 화살표로 브랜드 아이덴티티를 표현합니다."}}}},c={render:()=>e.jsx("div",{className:"h-64 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center",children:e.jsx(v,{})}),parameters:{docs:{description:{story:"타이핑 효과 섹션 컴포넌트입니다. 동적으로 변하는 텍스트와 커서 애니메이션을 제공합니다."}}}},l={render:()=>e.jsx("div",{className:"h-64 bg-black flex items-center justify-center",children:e.jsx(k,{text:"Developer",style:{color:"#ffffff",fontFamily:"inherit"}})}),parameters:{docs:{description:{story:'단일 타이핑 텍스트 컴포넌트입니다. "Hello," 텍스트와 함께 동적 텍스트를 표시합니다.'}}}},d={render:()=>e.jsx(f,{}),parameters:{docs:{description:{story:"메인 콘텐츠 컴포넌트입니다. 블로그 소개와 기술 스택 정보를 카드 형태로 표시합니다."}}}},m={render:()=>e.jsxs("div",{className:"space-y-8 bg-gray-50 min-h-screen p-4",children:[e.jsxs("div",{className:"bg-white rounded-lg shadow-sm overflow-hidden",children:[e.jsxs("div",{className:"p-4 bg-gray-100 border-b",children:[e.jsx("h3",{className:"font-semibold text-gray-700",children:"배경 비디오"}),e.jsx("p",{className:"text-sm text-gray-500",children:"자동 재생 풀스크린 배경"})]}),e.jsxs("div",{className:"relative h-64",children:[e.jsx(u,{}),e.jsx("div",{className:"absolute inset-0 bg-black/30 flex items-center justify-center",children:e.jsx("p",{className:"text-white font-semibold",children:"배경 비디오 재생 중"})})]})]}),e.jsxs("div",{className:"bg-black rounded-lg shadow-sm overflow-hidden",children:[e.jsxs("div",{className:"p-4 bg-gray-100 border-b",children:[e.jsx("h3",{className:"font-semibold text-gray-700",children:"블로그 타이틀"}),e.jsx("p",{className:"text-sm text-gray-500",children:"브랜드 아이덴티티 표현"})]}),e.jsx("div",{className:"h-32 bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center",children:e.jsx(b,{})})]}),e.jsxs("div",{className:"bg-white rounded-lg shadow-sm overflow-hidden",children:[e.jsxs("div",{className:"p-4 bg-gray-100 border-b",children:[e.jsx("h3",{className:"font-semibold text-gray-700",children:"타이핑 효과"}),e.jsx("p",{className:"text-sm text-gray-500",children:"동적 텍스트 애니메이션"})]}),e.jsx("div",{className:"h-32 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center",children:e.jsx(v,{})})]}),e.jsxs("div",{className:"bg-white rounded-lg shadow-sm overflow-hidden",children:[e.jsxs("div",{className:"p-4 bg-gray-100 border-b",children:[e.jsx("h3",{className:"font-semibold text-gray-700",children:"메인 콘텐츠"}),e.jsx("p",{className:"text-sm text-gray-500",children:"소개글과 기술 스택"})]}),e.jsx("div",{className:"p-0",children:e.jsx(f,{})})]})]}),decorators:[T],parameters:{docs:{description:{story:"모든 홈 페이지 컴포넌트를 한 번에 비교할 수 있는 갤러리 뷰입니다."}}}};var B,S,C,M,F;n.parameters={...n.parameters,docs:{...(B=n.parameters)==null?void 0:B.docs,source:{originalSource:`{
  render: () => <>\r
      <div className="h-[65vh] relative overflow-hidden w-full">\r
        <BackgroundVideo />\r
        <div className="absolute inset-0 bg-black/30">\r
          <div className="container mx-auto w-full px-4 h-full flex flex-col items-center justify-center space-y-12 text-center">\r
            <BlogTitle />\r
            <TypewriterSection />\r
          </div>\r
        </div>\r
      </div>\r
      <MainContent />\r
    </>,
  decorators: [withFullscreen],
  parameters: {
    docs: {
      description: {
        story: '완전한 홈 페이지 컴포넌트입니다. 비디오 배경, 타이틀, 타이핑 효과, 기술 스택 소개가 모두 포함되어 있습니다.'
      }
    }
  }
}`,...(C=(S=n.parameters)==null?void 0:S.docs)==null?void 0:C.source},description:{story:`## 전체 홈 페이지\r
\r
**구성**: 모든 홈 페이지 컴포넌트의 완전한 조합  \r
**높이**: 65vh (상단) + 콘텐츠 영역  \r
**배경**: 비디오 배경 + 오버레이 효과  \r
**특징**: \r
- 전체 화면 비디오 배경\r
- 중앙 정렬된 타이틀과 타이핑 효과\r
- 하단 기술 스택 소개 영역\r
- 어두운 오버레이로 텍스트 가독성 향상`,...(F=(M=n.parameters)==null?void 0:M.docs)==null?void 0:F.description}}};var H,_,V,I,D;o.parameters={...o.parameters,docs:{...(H=o.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: () => <div className="space-y-8 bg-gray-50 min-h-screen p-4">\r
      {/* 배경 비디오 */}\r
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">\r
        <div className="p-4 bg-gray-100 border-b">\r
          <h3 className="font-semibold text-gray-700">배경 비디오</h3>\r
          <p className="text-sm text-gray-500">자동 재생 풀스크린 배경</p>\r
        </div>\r
        <div className="relative h-64">\r
          <BackgroundVideo />\r
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">\r
            <p className="text-white font-semibold">배경 비디오 재생 중</p>\r
          </div>\r
        </div>\r
      </div>\r
    </div>,
  decorators: [withFullscreen],
  parameters: {
    docs: {
      description: {
        story: '홈 페이지의 배경 비디오 컴포넌트입니다. 자동 재생되며 전체 화면을 자연스럽게 채웁니다.'
      }
    }
  }
}`,...(V=(_=o.parameters)==null?void 0:_.docs)==null?void 0:V.source},description:{story:`## 배경 비디오\r
\r
**파일**: \`/Home_background.webm\`  \r
**기능**: 자동 재생, 무한 반복, 음소거  \r
**스타일**: 전체 화면 커버, 인라인 재생  \r
**특징**: \r
- 자동 재생 및 무한 반복\r
- 모바일에서도 인라인 재생 지원\r
- 음소거 상태로 재생\r
- 전체 화면을 자연스럽게 커버`,...(D=(I=o.parameters)==null?void 0:I.docs)==null?void 0:D.description}}};var A,E,L,P,R;i.parameters={...i.parameters,docs:{...(A=i.parameters)==null?void 0:A.docs,source:{originalSource:`{
  name: '블로그 타이틀',
  render: () => <div className="h-64 bg-black flex items-center justify-center">\r
      <BlogTitle />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: '블로그 타이틀 컴포넌트입니다. 둥근 테두리와 하단 화살표로 브랜드 아이덴티티를 표현합니다.'
      }
    }
  }
}`,...(L=(E=i.parameters)==null?void 0:E.docs)==null?void 0:L.source},description:{story:`## 블로그 타이틀\r
\r
**텍스트**: "Van's Dev Blog"  \r
**스타일**: 둥근 테두리, 투명 배경, 흰색 텍스트  \r
**장식**: 하단 삼각형 화살표  \r
**특징**: \r
- 깔끔한 둥근 테두리 디자인\r
- 투명한 배경으로 비디오와 조화\r
- 하단 화살표로 시각적 포인트 제공\r
- 브랜드 아이덴티티를 강화하는 폰트`,...(R=(P=i.parameters)==null?void 0:P.docs)==null?void 0:R.description}}};var q,G,O,W,$;c.parameters={...c.parameters,docs:{...(q=c.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: () => <div className="h-64 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">\r
      <TypewriterSection />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: '타이핑 효과 섹션 컴포넌트입니다. 동적으로 변하는 텍스트와 커서 애니메이션을 제공합니다.'
      }
    }
  }
}`,...(O=(G=c.parameters)==null?void 0:G.docs)==null?void 0:O.source},description:{story:`## 타이핑 효과 섹션\r
\r
**구성**: TypewriterText 컴포넌트 래퍼  \r
**효과**: 동적으로 변하는 텍스트와 커서 애니메이션  \r
**텍스트**: "World", "Developer", "Everyone" 순환  \r
**특징**: \r
- "Hello," 고정 텍스트 + 동적 텍스트\r
- 부드러운 타이핑 효과 애니메이션\r
- 깜빡이는 커서 효과\r
- 여러 텍스트 간 자연스러운 전환`,...($=(W=c.parameters)==null?void 0:W.docs)==null?void 0:$.description}}};var X,J,K,Q,U;l.parameters={...l.parameters,docs:{...(X=l.parameters)==null?void 0:X.docs,source:{originalSource:`{
  render: () => <div className="h-64 bg-black flex items-center justify-center">\r
      <TypewriterText text="Developer" style={{
      color: '#ffffff',
      fontFamily: 'inherit'
    }} />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: '단일 타이핑 텍스트 컴포넌트입니다. "Hello," 텍스트와 함께 동적 텍스트를 표시합니다.'
      }
    }
  }
}`,...(K=(J=l.parameters)==null?void 0:J.docs)==null?void 0:K.source},description:{story:`## 타이핑 텍스트 (단일)\r
\r
**텍스트**: 예시 "Developer"  \r
**구조**: "Hello," + 동적 텍스트 + 커서  \r
**애니메이션**: 커서 깜빡임  \r
**특징**: \r
- 큰 폰트 사이즈 (text-6xl)\r
- 흰색 텍스트로 가독성 확보\r
- 중앙 정렬 레이아웃\r
- 커서 애니메이션으로 타이핑 느낌 강화`,...(U=(Q=l.parameters)==null?void 0:Q.docs)==null?void 0:U.description}}};var Y,Z,ee,re,se;d.parameters={...d.parameters,docs:{...(Y=d.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: () => <MainContent />,
  parameters: {
    docs: {
      description: {
        story: '메인 콘텐츠 컴포넌트입니다. 블로그 소개와 기술 스택 정보를 카드 형태로 표시합니다.'
      }
    }
  }
}`,...(ee=(Z=d.parameters)==null?void 0:Z.docs)==null?void 0:ee.source},description:{story:`## 메인 콘텐츠\r
\r
**배경**: 다크 그레이 + 그리드 패턴  \r
**구성**: 소개 텍스트 + 기술 스택 태그  \r
**카드**: 그레이 배경의 둥근 카드 형태  \r
**특징**: \r
- 그리드 패턴 배경으로 기술적 느낌\r
- 기술 스택별 아이콘과 호버 효과\r
- 카드 형태의 깔끔한 레이아웃\r
- 다국어 지원 (i18n)\r
- 단계별 정보 표시 (인사말 → 기술 소개 → 마무리)`,...(se=(re=d.parameters)==null?void 0:re.docs)==null?void 0:se.description}}};var te,ae,ne,oe,ie;m.parameters={...m.parameters,docs:{...(te=m.parameters)==null?void 0:te.docs,source:{originalSource:`{
  render: () => <div className="space-y-8 bg-gray-50 min-h-screen p-4">\r
      {/* 배경 비디오 */}\r
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">\r
        <div className="p-4 bg-gray-100 border-b">\r
          <h3 className="font-semibold text-gray-700">배경 비디오</h3>\r
          <p className="text-sm text-gray-500">자동 재생 풀스크린 배경</p>\r
        </div>\r
        <div className="relative h-64">\r
          <BackgroundVideo />\r
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">\r
            <p className="text-white font-semibold">배경 비디오 재생 중</p>\r
          </div>\r
        </div>\r
      </div>\r
\r
      {/* 블로그 타이틀 */}\r
      <div className="bg-black rounded-lg shadow-sm overflow-hidden">\r
        <div className="p-4 bg-gray-100 border-b">\r
          <h3 className="font-semibold text-gray-700">블로그 타이틀</h3>\r
          <p className="text-sm text-gray-500">브랜드 아이덴티티 표현</p>\r
        </div>\r
        <div className="h-32 bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">\r
          <BlogTitle />\r
        </div>\r
      </div>\r
\r
      {/* 타이핑 효과 */}\r
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">\r
        <div className="p-4 bg-gray-100 border-b">\r
          <h3 className="font-semibold text-gray-700">타이핑 효과</h3>\r
          <p className="text-sm text-gray-500">동적 텍스트 애니메이션</p>\r
        </div>\r
        <div className="h-32 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">\r
          <TypewriterSection />\r
        </div>\r
      </div>\r
\r
      {/* 메인 콘텐츠 */}\r
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">\r
        <div className="p-4 bg-gray-100 border-b">\r
          <h3 className="font-semibold text-gray-700">메인 콘텐츠</h3>\r
          <p className="text-sm text-gray-500">소개글과 기술 스택</p>\r
        </div>\r
        <div className="p-0">\r
          <MainContent />\r
        </div>\r
      </div>\r
    </div>,
  decorators: [withFullscreen],
  parameters: {
    docs: {
      description: {
        story: '모든 홈 페이지 컴포넌트를 한 번에 비교할 수 있는 갤러리 뷰입니다.'
      }
    }
  }
}`,...(ne=(ae=m.parameters)==null?void 0:ae.docs)==null?void 0:ne.source},description:{story:`## 전체 컴포넌트 비교\r
\r
모든 홈 페이지 컴포넌트를 개별적으로 확인할 수 있는 갤러리 뷰입니다.\r
각 컴포넌트의 특징과 스타일을 직관적으로 비교할 수 있습니다.`,...(ie=(oe=m.parameters)==null?void 0:oe.docs)==null?void 0:ie.description}}};const Be=["FullHomePage","BackgroundVideoComponent","BlogTitleComponent","TypewriterSectionComponent","TypewriterTextComponent","MainContentComponent","AllHomeComponents"];export{m as AllHomeComponents,o as BackgroundVideoComponent,i as BlogTitleComponent,n as FullHomePage,d as MainContentComponent,c as TypewriterSectionComponent,l as TypewriterTextComponent,Be as __namedExportsOrder,ze as default};
