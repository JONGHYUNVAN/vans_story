import{a as f,f as Be,j as e}from"./iframe-JTgUOfHV.js";import{L as A}from"./link-DkhhGrwS.js";import{M as De}from"./index-U0Mtvn3H.js";import{u as Te,G as Ae}from"./i18n-DtTisMBQ.js";import{S as Me,a as Ie,b as Le,c as qe,d as _e}from"./index-y5QHQkV5.js";function s({frameworkName:r,frameworkIcon:t,frameworkColor:k,frameworkPath:me,backgroundClasses:Ve="bg-black",previewButtonBgClasses:ue="bg-black/50 backdrop-blur-sm",sidebarContentBgClasses:ge="bg-black",textColorClasses:C="text-[#888888]",hoverStyles:xe="hover:bg-white/5",activeLinkStyles:be="text-white bg-white/5",headerBgClasses:he="backdrop-blur-sm bg-black/30",borderClasses:x="border-[#333333]",logoAnimation:fe="transition-transform duration-300 group-hover:scale-105",iconRenderer:ye=(b,g)=>e.jsx(b,{className:"w-4 h-4",style:{color:g}}),backgroundLayerRenderer:u,headerHoverTextClass:ve="hover:text-white",descriptionTextClass:Se="text-[#666666]",categoryTitleClass:we="text-[#666666]"}){const{t:b}=Te(),[g,B]=f.useState(!1),[h,Je]=f.useState(!0),Ne=Be();f.useEffect(()=>{},[]);const je=D=>t;return e.jsxs("div",{className:"w-64 h-full",onMouseEnter:()=>{h&&B(!0)},onMouseLeave:()=>{h&&B(!1)},children:[e.jsxs("div",{className:`
        absolute left-0 top-0 h-full w-16
        flex items-center justify-center
        ${ue} rounded-r-lg
        transform transition-all duration-300 ease-in-out border-r ${x}
        ${!h||g?"opacity-0 pointer-events-none":"opacity-30"}
      `,children:[e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx("div",{className:"text-center mb-2",children:e.jsx(t,{className:"w-8 h-8 mb-1 mx-auto",style:{color:k}})}),e.jsx("span",{className:"text-base font-bold text-gray-800 font-handwriting text-center",children:r})]}),e.jsx(De,{className:"w-5 h-5 text-gray-800 animate-[bounce-right_1s_infinite] absolute right-1"})]}),e.jsxs("div",{className:`
        absolute top-0 left-0 w-64 h-full
        ${ge} ${C} border-r ${x} rounded-r-lg overflow-hidden
        transform transition-all duration-300 ease-in-out
        ${g?"translate-x-0 opacity-100 pointer-events-auto":"-translate-x-64 opacity-0 pointer-events-none"}
      `,children:[u&&u(),e.jsx("div",{className:`p-4 border-b ${x} ${he} ${u?"relative z-10":""}`,children:e.jsxs(A,{href:me,className:`flex items-center gap-2 text-xl font-bold text-gray-800 transition-colors duration-300 ${ve}`,children:[e.jsx(t,{className:`w-8 h-8 ${fe}`,style:{color:k}}),r]})}),e.jsx("nav",{className:`px-3 py-4 overflow-y-auto max-h-[calc(100vh-80px)] ${u?"relative z-10":""}`,children:Object.entries(b(`${r}.categories`)).map(([D,T])=>e.jsxs("div",{className:"mb-8",children:[e.jsx("h2",{className:`mb-4 px-4 text-sm font-semibold tracking-wide ${we} uppercase`,children:T.title}),e.jsx("div",{className:"space-y-3",children:Object.entries(T.items).map(([ke,a])=>{const Ce=je(a.icon);return e.jsxs("div",{className:"space-y-1",children:[e.jsx(A,{href:a.path,className:`group block px-4 py-1.5 rounded-md transition-all duration-300 ease-in-out ${xe} ${Ne===a.path?be:C}`,children:e.jsxs("span",{className:"transition-colors duration-300 group-hover:text-white flex items-center gap-2",children:[ye(Ce,a.color),a.title]})}),e.jsx("p",{className:`px-4 py-1 text-xs ${Se} leading-relaxed`,children:a.description})]},ke)})})]},D))})]})]})}s.__docgenInfo={description:"",methods:[],displayName:"BaseSidebar",props:{frameworkName:{required:!0,tsType:{name:"string"},description:""},frameworkIcon:{required:!0,tsType:{name:"IconType"},description:""},frameworkColor:{required:!0,tsType:{name:"string"},description:""},frameworkPath:{required:!0,tsType:{name:"string"},description:""},backgroundClasses:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"bg-black"',computed:!1}},previewButtonBgClasses:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"bg-black/50 backdrop-blur-sm"',computed:!1}},sidebarContentBgClasses:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"bg-black"',computed:!1}},textColorClasses:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"text-[#888888]"',computed:!1}},hoverStyles:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"hover:bg-white/5"',computed:!1}},activeLinkStyles:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"text-white bg-white/5"',computed:!1}},headerBgClasses:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"backdrop-blur-sm bg-black/30"',computed:!1}},borderClasses:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"border-[#333333]"',computed:!1}},logoAnimation:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"transition-transform duration-300 group-hover:scale-105"',computed:!1}},iconRenderer:{required:!1,tsType:{name:"signature",type:"function",raw:"(icon: IconType, color: string) => ReactNode",signature:{arguments:[{type:{name:"IconType"},name:"icon"},{type:{name:"string"},name:"color"}],return:{name:"ReactNode"}}},description:"",defaultValue:{value:'(Icon, color) => <Icon className="w-4 h-4" style={{ color }} />',computed:!1}},backgroundLayerRenderer:{required:!1,tsType:{name:"signature",type:"function",raw:"() => ReactNode",signature:{arguments:[],return:{name:"ReactNode"}}},description:""},headerHoverTextClass:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"hover:text-white"',computed:!1}},descriptionTextClass:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"text-[#666666]"',computed:!1}},categoryTitleClass:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"text-[#666666]"',computed:!1}}}};function $e(r){return Ae({attr:{viewBox:"0 0 24 24",fill:"currentColor"},child:[{tag:"path",attr:{d:"M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM4 5V19H20V5H4ZM20 12L16.4645 15.5355L15.0503 14.1213L17.1716 12L15.0503 9.87868L16.4645 8.46447L20 12ZM6.82843 12L8.94975 14.1213L7.53553 15.5355L4 12L7.53553 8.46447L8.94975 9.87868L6.82843 12ZM11.2443 17H9.11597L12.7557 7H14.884L11.2443 17Z"},child:[]}]})(r)}function y(){return e.jsx(s,{frameworkName:"Algorithm",frameworkIcon:$e,frameworkColor:"#6B7280",frameworkPath:"/post/view/algorithm",backgroundClasses:"bg-white",sidebarContentBgClasses:"bg-white",headerBgClasses:"bg-white",previewButtonBgClasses:"bg-white shadow-sm",textColorClasses:"text-gray-700",categoryTitleClass:"text-gray-700",descriptionTextClass:"text-gray-500",headerHoverTextClass:"hover:text-gray-900",hoverStyles:"hover:bg-gray-100",activeLinkStyles:"text-gray-900 bg-gray-100",borderClasses:"border-black",iconRenderer:(r,t)=>e.jsx("div",{className:"relative flex items-center justify-center w-6 h-6 transition-colors duration-200 ease-in-out text-gray-600",children:e.jsx(r,{className:"w-5 h-5"})})})}y.__docgenInfo={description:`알고리즘 전용 사이드바 컴포넌트\r
알고리즘의 깔끔한 화이트 테마를 적용한 미니멀한 스타일의 사이드바입니다.`,methods:[],displayName:"AlgorithmSidebar"};function v(){return e.jsx(s,{frameworkName:"Spring",frameworkIcon:Me,frameworkColor:"#6DB33F",frameworkPath:"/post/view/spring",sidebarContentBgClasses:"bg-[#0c1511]",headerBgClasses:"backdrop-blur-sm",previewButtonBgClasses:"bg-[#0c1511] backdrop-blur-sm",textColorClasses:"text-gray-300",categoryTitleClass:"text-gray-400",descriptionTextClass:"text-gray-500",headerHoverTextClass:"hover:text-[#9DE67E]/80",hoverStyles:"hover:bg-slate-800/40",activeLinkStyles:"text-white bg-slate-800/50",borderClasses:"border-slate-700/40",logoAnimation:"transition-transform duration-300 group-hover:scale-105",backgroundLayerRenderer:()=>e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-to-b from-[#2f3b22] to-[#0a100d] z-0"}),e.jsx("div",{className:"absolute inset-0 opacity-5 bg-[url('/spring-pattern.png')] bg-repeat z-0"})]})})}v.__docgenInfo={description:`Spring 전용 사이드바 컴포넌트\r
Spring의 그린 그라데이션 테마를 적용한 특별한 배경 레이어 스타일의 사이드바입니다.`,methods:[],displayName:"SpringSidebar"};function S(){return e.jsx(s,{frameworkName:"Nextjs",frameworkIcon:Ie,frameworkColor:"#000000",frameworkPath:"/post/view/nextjs",textColorClasses:"text-[#888888]",borderClasses:"border-[#333333]",iconRenderer:(r,t)=>e.jsx(r,{className:"w-4 h-4 p-[1px] bg-white rounded-full",style:{color:t}})})}S.__docgenInfo={description:`Next.js 전용 사이드바 컴포넌트\r
Next.js의 블랙 테마를 적용한 미니멀한 스타일의 사이드바입니다.`,methods:[],displayName:"NextSidebar"};function w(){return e.jsx(s,{frameworkName:"MariaDB",frameworkIcon:Le,frameworkColor:"#2A3034",frameworkPath:"/post/view/mariadb",backgroundClasses:"bg-gradient-to-br from-[#1A2024] to-[#2A3034]",sidebarContentBgClasses:"bg-gradient-to-br from-[#1A2024] to-[#2A3034]",headerBgClasses:"backdrop-blur-sm bg-[#1A2024]/70",previewButtonBgClasses:"bg-[#1A2024]/70 backdrop-blur-sm",textColorClasses:"text-[#A7B6BD]",categoryTitleClass:"text-[#8FA7AF]",descriptionTextClass:"text-[#7A868D]",headerHoverTextClass:"hover:text-white",hoverStyles:"hover:bg-white/10",activeLinkStyles:"text-white bg-white/10",borderClasses:"border-[#3A4044]/30",logoAnimation:"transition-transform duration-300 group-hover:scale-110",iconRenderer:(r,t)=>e.jsx(r,{className:"w-4 h-4 p-[1px] rounded-full bg-gradient-to-br from-[#3A4044] to-[#1A2024]",style:{color:t}})})}w.__docgenInfo={description:`MariaDB 전용 사이드바 컴포넌트\r
MariaDB의 다크 그레이 그라데이션 테마를 적용한 데이터베이스 스타일의 사이드바입니다.`,methods:[],displayName:"MariaDBSidebar"};function N(){return e.jsx(s,{frameworkName:"Nestjs",frameworkIcon:qe,frameworkColor:"#E0234E",frameworkPath:"/post/view/nestjs",textColorClasses:"text-[#888888]",borderClasses:"border-[#333333]"})}N.__docgenInfo={description:`NestJS 전용 사이드바 컴포넌트\r
NestJS의 빨간색 테마를 적용한 미니멀한 스타일의 사이드바입니다.`,methods:[],displayName:"NestSidebar"};function j(){return e.jsx(s,{frameworkName:"Docker",frameworkIcon:_e,frameworkColor:"#2496ED",frameworkPath:"/post/view/docker",sidebarContentBgClasses:"bg-[#0d1117]",headerBgClasses:"backdrop-blur-sm",previewButtonBgClasses:"bg-[#0d1117] backdrop-blur-sm",textColorClasses:"text-gray-300",categoryTitleClass:"text-gray-400",descriptionTextClass:"text-gray-500",headerHoverTextClass:"hover:text-[#2496ED]/80",hoverStyles:"hover:bg-slate-800/40",activeLinkStyles:"text-white bg-slate-800/50",borderClasses:"border-slate-700/40",logoAnimation:"transition-transform duration-300 group-hover:scale-105",backgroundLayerRenderer:()=>e.jsx(e.Fragment,{children:e.jsx("div",{className:"absolute inset-0 bg-gradient-to-b from-[#121920] to-[#0a1017] z-0"})})})}j.__docgenInfo={description:`Docker 전용 사이드바 컴포넌트\r
Docker의 블루 그라데이션 테마를 적용한 컨테이너 중심의 특별한 배경 레이어 스타일 사이드바입니다.`,methods:[],displayName:"DockerSidebar"};const Oe={title:"UI/Layout/Sidebar",parameters:{docs:{description:{component:"기술별로 테마가 다른 사이드바 갤러리입니다. 각 사이드바는 고유한 스타일과 브랜드 컬러를 가지고 있습니다."}},layout:"fullscreen"}},n={render:()=>e.jsx("div",{style:{position:"relative",width:"256px",height:"100vh"},children:e.jsx(y,{})}),parameters:{docs:{description:{story:"알고리즘 포스트용 화이트 테마 사이드바입니다. 깔끔하고 가독성이 좋은 디자인이 특징입니다."}}}},i={render:()=>e.jsx(v,{}),parameters:{docs:{description:{story:"Spring Boot 포스트용 그린 테마 사이드바입니다. 커스텀 배경 레이어와 그라데이션 효과가 특징입니다."}}}},d={render:()=>e.jsx(S,{}),parameters:{docs:{description:{story:"Next.js 포스트용 블랙 테마 사이드바입니다. 미니멀한 디자인과 원형 아이콘 배경이 특징입니다."}}}},l={render:()=>e.jsx(w,{}),parameters:{docs:{description:{story:"MariaDB 포스트용 다크 그레이 테마 사이드바입니다. 그라데이션 배경과 전문적인 느낌이 특징입니다."}}}},c={render:()=>e.jsx(N,{}),parameters:{docs:{description:{story:"NestJS 포스트용 빨간색 테마 사이드바입니다. NestJS 브랜드 컬러와 미니멀한 디자인이 특징입니다."}}}},p={render:()=>e.jsx(j,{}),parameters:{docs:{description:{story:"Docker 포스트용 블루 테마 사이드바입니다. 커스텀 배경 레이어와 Docker 브랜드 컬러가 특징입니다."}}}};function o({children:r,title:t}){return e.jsxs("div",{className:"relative bg-white rounded-lg shadow-md overflow-hidden border",style:{width:"280px",height:"380px"},children:[e.jsx("div",{className:"text-center p-2 bg-gray-800 text-white font-semibold text-xs",children:t}),e.jsx("div",{className:"relative overflow-auto",style:{height:"500px",transform:"scale(0.72)",transformOrigin:"top left"},children:e.jsx("div",{style:{position:"relative",width:"256px",height:"500px"},children:r})})]})}const m={render:()=>e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, 320px)",gridTemplateRows:"repeat(2, 400px)",gap:"20px",padding:"20px",backgroundColor:"#f9fafb",justifyContent:"center",alignContent:"center",minHeight:"100vh"},children:[e.jsx(o,{title:"Algorithm",children:e.jsx(y,{})}),e.jsx(o,{title:"Spring Boot",children:e.jsx(v,{})}),e.jsx(o,{title:"Next.js",children:e.jsx(S,{})}),e.jsx(o,{title:"MariaDB",children:e.jsx(w,{})}),e.jsx(o,{title:"NestJS",children:e.jsx(N,{})}),e.jsx(o,{title:"Docker",children:e.jsx(j,{})})]}),parameters:{docs:{description:{story:"모든 사이드바를 한 번에 비교할 수 있는 갤러리 뷰입니다. 각 테마의 특징을 직관적으로 확인할 수 있습니다."}}}};var M,I,L,q,_;n.parameters={...n.parameters,docs:{...(M=n.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: () => <div style={{
    position: 'relative',
    width: '256px',
    height: '100vh'
  }}>\r
      <AlgorithmSidebar />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: '알고리즘 포스트용 화이트 테마 사이드바입니다. 깔끔하고 가독성이 좋은 디자인이 특징입니다.'
      }
    }
  }
}`,...(L=(I=n.parameters)==null?void 0:I.docs)==null?void 0:L.source},description:{story:`## 알고리즘 사이드바\r
\r
**테마**: 깔끔한 화이트 테마  \r
**컬러**: 그레이 계열 (#6B7280)  \r
**스타일**: 미니멀하고 심플한 디자인  \r
**특징**: \r
- 흰색 배경에 회색 텍스트로 가독성이 뛰어남\r
- 검정 테두리로 명확한 경계 구분\r
- 호버 시 연한 그레이 하이라이트`,...(_=(q=n.parameters)==null?void 0:q.docs)==null?void 0:_.description}}};var $,V,J,E,H;i.parameters={...i.parameters,docs:{...($=i.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: () => <SpringSidebar />,
  parameters: {
    docs: {
      description: {
        story: 'Spring Boot 포스트용 그린 테마 사이드바입니다. 커스텀 배경 레이어와 그라데이션 효과가 특징입니다.'
      }
    }
  }
}`,...(J=(V=i.parameters)==null?void 0:V.docs)==null?void 0:J.source},description:{story:`## Spring Boot 사이드바\r
\r
**테마**: 그린 그라데이션 + 커스텀 배경 레이어  \r
**컬러**: Spring 그린 (#6DB33F)  \r
**스타일**: 다크 배경에 그린 포인트  \r
**특징**: \r
- 특별한 배경 레이어 렌더링\r
- 그라데이션 배경 효과\r
- Spring 브랜드 컬러 적용\r
- 블러 효과가 적용된 헤더`,...(H=(E=i.parameters)==null?void 0:E.docs)==null?void 0:H.description}}};var R,W,P,O,z;d.parameters={...d.parameters,docs:{...(R=d.parameters)==null?void 0:R.docs,source:{originalSource:`{
  render: () => <NextSidebar />,
  parameters: {
    docs: {
      description: {
        story: 'Next.js 포스트용 블랙 테마 사이드바입니다. 미니멀한 디자인과 원형 아이콘 배경이 특징입니다.'
      }
    }
  }
}`,...(P=(W=d.parameters)==null?void 0:W.docs)==null?void 0:P.source},description:{story:`## Next.js 사이드바\r
\r
**테마**: 블랙 미니멀 + 원형 배경  \r
**컬러**: Next.js 블랙 (#000000)  \r
**스타일**: 미니멀한 다크 테마  \r
**특징**: \r
- Next.js 아이콘에 흰색 원형 배경 적용\r
- 미니멀한 다크 그레이 텍스트\r
- 깔끔한 검정 테두리\r
- 심플하고 세련된 디자인`,...(z=(O=d.parameters)==null?void 0:O.docs)==null?void 0:z.description}}};var Z,F,G,K,U;l.parameters={...l.parameters,docs:{...(Z=l.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  render: () => <MariaDBSidebar />,
  parameters: {
    docs: {
      description: {
        story: 'MariaDB 포스트용 다크 그레이 테마 사이드바입니다. 그라데이션 배경과 전문적인 느낌이 특징입니다.'
      }
    }
  }
}`,...(G=(F=l.parameters)==null?void 0:F.docs)==null?void 0:G.source},description:{story:`## MariaDB 사이드바\r
\r
**테마**: 다크 그레이 그라데이션  \r
**컬러**: MariaDB 다크 그레이 (#2A3034)  \r
**스타일**: 데이터베이스 전문가를 위한 다크 테마  \r
**특징**: \r
- 그라데이션 배경 (#1A2024 → #2A3034)\r
- 블루-그레이 텍스트 컬러\r
- 전문적이고 안정적인 느낌\r
- 블러 효과 헤더`,...(U=(K=l.parameters)==null?void 0:K.docs)==null?void 0:U.description}}};var Q,X,Y,ee,re;c.parameters={...c.parameters,docs:{...(Q=c.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  render: () => <NestSidebar />,
  parameters: {
    docs: {
      description: {
        story: 'NestJS 포스트용 빨간색 테마 사이드바입니다. NestJS 브랜드 컬러와 미니멀한 디자인이 특징입니다.'
      }
    }
  }
}`,...(Y=(X=c.parameters)==null?void 0:X.docs)==null?void 0:Y.source},description:{story:`## NestJS 사이드바\r
\r
**테마**: 빨간색 미니멀  \r
**컬러**: NestJS 빨간색 (#E0234E)  \r
**스타일**: 간결한 다크 테마  \r
**특징**: \r
- NestJS 브랜드 빨간색 아이콘\r
- 미니멀한 다크 그레이 텍스트\r
- 검정 배경에 깔끔한 디자인\r
- 심플하면서도 강렬한 포인트 컬러`,...(re=(ee=c.parameters)==null?void 0:ee.docs)==null?void 0:re.description}}};var te,se,ae,oe,ne;p.parameters={...p.parameters,docs:{...(te=p.parameters)==null?void 0:te.docs,source:{originalSource:`{
  render: () => <DockerSidebar />,
  parameters: {
    docs: {
      description: {
        story: 'Docker 포스트용 블루 테마 사이드바입니다. 커스텀 배경 레이어와 Docker 브랜드 컬러가 특징입니다.'
      }
    }
  }
}`,...(ae=(se=p.parameters)==null?void 0:se.docs)==null?void 0:ae.source},description:{story:`## Docker 사이드바\r
\r
**테마**: 블루 그라데이션 + 커스텀 배경 레이어  \r
**컬러**: Docker 블루 (#2496ED)  \r
**스타일**: 컨테이너 중심의 다크 테마  \r
**특징**: \r
- 특별한 배경 레이어 렌더링\r
- Docker 브랜드 블루 컬러\r
- 다크 배경 (#0d1117)\r
- 블러 효과와 그라데이션`,...(ne=(oe=p.parameters)==null?void 0:oe.docs)==null?void 0:ne.description}}};var ie,de,le,ce,pe;m.parameters={...m.parameters,docs:{...(ie=m.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 320px)',
    gridTemplateRows: 'repeat(2, 400px)',
    gap: '20px',
    padding: '20px',
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignContent: 'center',
    minHeight: '100vh'
  }}>\r
      <SidebarWrapper title="Algorithm">\r
        <AlgorithmSidebar />\r
      </SidebarWrapper>\r
      \r
      <SidebarWrapper title="Spring Boot">\r
        <SpringSidebar />\r
      </SidebarWrapper>\r
      \r
      <SidebarWrapper title="Next.js">\r
        <NextSidebar />\r
      </SidebarWrapper>\r
      \r
      <SidebarWrapper title="MariaDB">\r
        <MariaDBSidebar />\r
      </SidebarWrapper>\r
      \r
      <SidebarWrapper title="NestJS">\r
        <NestSidebar />\r
      </SidebarWrapper>\r
      \r
      <SidebarWrapper title="Docker">\r
        <DockerSidebar />\r
      </SidebarWrapper>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: '모든 사이드바를 한 번에 비교할 수 있는 갤러리 뷰입니다. 각 테마의 특징을 직관적으로 확인할 수 있습니다.'
      }
    }
  }
}`,...(le=(de=m.parameters)==null?void 0:de.docs)==null?void 0:le.source},description:{story:`## 전체 사이드바 비교\r
\r
모든 사이드바를 한 번에 비교해볼 수 있는 갤러리 뷰입니다.\r
각 사이드바의 테마와 스타일 차이를 직관적으로 확인할 수 있습니다.`,...(pe=(ce=m.parameters)==null?void 0:ce.docs)==null?void 0:pe.description}}};const ze=["Algorithm","Spring","NextJS","MariaDB","NestJS","Docker","AllSidebars"];export{n as Algorithm,m as AllSidebars,p as Docker,l as MariaDB,c as NestJS,d as NextJS,i as Spring,ze as __namedExportsOrder,Oe as default};
