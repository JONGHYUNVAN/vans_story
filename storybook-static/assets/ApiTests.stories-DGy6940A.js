import{j as e,a as m}from"./iframe-JTgUOfHV.js";import{w as H}from"./index-DDGduCHk.js";const r={getSuccess:t=>({data:t,status:200,error:null,loading:!1}),postSuccess:t=>({data:{...t,createdAt:new Date().toISOString()},status:201,error:null,loading:!1}),patchSuccess:t=>({data:{...t,updatedAt:new Date().toISOString()},status:200,error:null,loading:!1}),deleteSuccess:()=>({data:{success:!0,message:"성공적으로 삭제되었습니다."},status:204,error:null,loading:!1}),loading:()=>({data:null,status:0,error:null,loading:!0}),error:(t,a=500)=>({data:null,status:a,error:t,loading:!1}),authError:()=>({data:null,status:401,error:"인증이 필요합니다.",loading:!1}),permissionError:()=>({data:null,status:403,error:"권한이 없습니다.",loading:!1}),notFoundError:()=>({data:null,status:404,error:"요청한 리소스를 찾을 수 없습니다.",loading:!1})},o={getSingle:r.getSuccess({_id:"507f1f77bcf86cd799439011",title:"게시글 제목",content:"게시글 내용입니다.",theme:"dark",authorEmail:"user@example.com",author:"닉네임",createdAt:"2024-03-19T09:00:00.000Z",updatedAt:"2024-03-19T09:00:00.000Z",description:"게시글 설명입니다.",tags:["태그1","태그2"],viewCount:0,likeCount:0,category:"introduction",thumbnail:"thumbnail.jpg",language:"ko",topic:"Java 알고리즘"}),getList:r.getSuccess([{_id:"507f1f77bcf86cd799439011",title:"첫 번째 게시글",description:"첫 번째 게시글 설명",tags:["React","Next.js"],viewCount:125,likeCount:15},{_id:"507f1f77bcf86cd799439012",title:"두 번째 게시글",description:"두 번째 게시글 설명",tags:["Spring","Java"],viewCount:89,likeCount:7}]),create:r.postSuccess({_id:"507f1f77bcf86cd799439013",title:"새로운 게시글",content:"새로운 게시글 내용",author:"작성자"}),update:r.patchSuccess({_id:"507f1f77bcf86cd799439011",title:"수정된 게시글 제목",content:"수정된 게시글 내용"}),delete:r.deleteSuccess()},g={loginSuccess:r.postSuccess({user:{id:"user123",email:"user@example.com",nickname:"사용자닉네임"},tokens:{accessToken:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",refreshToken:"refresh_token_example"}}),loginFailure:r.error("이메일 또는 비밀번호가 잘못되었습니다.",401),logoutSuccess:r.postSuccess({message:"성공적으로 로그아웃되었습니다."}),refreshSuccess:r.postSuccess({accessToken:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",refreshToken:"new_refresh_token_example"})},X={title:"Features/API",decorators:[H],parameters:{docs:{description:{component:"API 응답 상태를 시각적으로 테스트하고 확인할 수 있는 갤러리입니다. 모의 데이터를 사용하여 다양한 시나리오를 테스트합니다."}}}};function s({title:t,description:a,response:i,status:u="success"}){const G=()=>{switch(u){case"success":return"border-green-200 bg-green-50";case"error":return"border-red-200 bg-red-50";case"loading":return"border-blue-200 bg-blue-50";default:return"border-gray-200 bg-gray-50"}},z=()=>{switch(u){case"success":return e.jsx("span",{className:"px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium",children:"성공"});case"error":return e.jsx("span",{className:"px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium",children:"에러"});case"loading":return e.jsx("span",{className:"px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium",children:"로딩중"});default:return null}};return e.jsxs("div",{className:`border rounded-lg p-4 ${G()}`,children:[e.jsxs("div",{className:"flex items-center justify-between mb-3",children:[e.jsx("h3",{className:"font-semibold text-gray-800",children:t}),z()]}),e.jsx("p",{className:"text-sm text-gray-600 mb-4",children:a}),i.loading?e.jsxs("div",{className:"flex items-center gap-2 p-4 bg-blue-100 rounded border border-blue-200",children:[e.jsx("div",{className:"animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"}),e.jsx("span",{className:"text-blue-700 font-medium",children:"데이터를 불러오는 중..."})]}):i.error?e.jsxs("div",{className:"p-4 bg-red-100 rounded border border-red-200",children:[e.jsx("div",{className:"flex items-center gap-2 mb-2",children:e.jsxs("span",{className:"text-red-600 font-medium",children:["❌ Error ",i.status]})}),e.jsx("p",{className:"text-red-700",children:i.error})]}):e.jsxs("div",{className:"p-4 bg-gray-100 rounded border border-gray-200",children:[e.jsx("div",{className:"flex items-center gap-2 mb-2",children:e.jsxs("span",{className:"text-green-600 font-medium",children:["✅ Status ",i.status]})}),e.jsx("pre",{className:"text-xs text-gray-700 overflow-auto max-h-40",children:JSON.stringify(i.data,null,2)})]})]})}const n={render:()=>e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6",children:[e.jsx(s,{title:"포스트 조회 (GET)",description:"단일 포스트의 상세 정보를 가져옵니다.",response:o.getSingle,status:"success"}),e.jsx(s,{title:"포스트 목록 (GET)",description:"페이지네이션된 포스트 목록을 가져옵니다.",response:o.getList,status:"success"}),e.jsx(s,{title:"포스트 생성 (POST)",description:"새로운 포스트를 생성합니다.",response:o.create,status:"success"}),e.jsx(s,{title:"포스트 수정 (PATCH)",description:"기존 포스트를 수정합니다.",response:o.update,status:"success"}),e.jsx(s,{title:"포스트 삭제 (DELETE)",description:"포스트를 삭제합니다.",response:o.delete,status:"success"})]}),parameters:{docs:{description:{story:"포스트 관련 API의 모든 CRUD 작업을 테스트합니다. 각 응답 형태와 상태 코드를 확인할 수 있습니다."}}}},c={render:()=>e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6",children:[e.jsx(s,{title:"로그인 성공",description:"올바른 인증 정보로 로그인 성공",response:g.loginSuccess,status:"success"}),e.jsx(s,{title:"로그인 실패",description:"잘못된 인증 정보로 로그인 실패",response:g.loginFailure,status:"error"}),e.jsx(s,{title:"로그아웃",description:"안전한 로그아웃 처리",response:g.logoutSuccess,status:"success"}),e.jsx(s,{title:"토큰 갱신",description:"리프레시 토큰으로 액세스 토큰 갱신",response:g.refreshSuccess,status:"success"})]}),parameters:{docs:{description:{story:"인증 관련 API의 성공/실패 시나리오를 테스트합니다. JWT 토큰 관리도 포함됩니다."}}}},d={render:()=>e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6",children:[e.jsx(s,{title:"인증 에러 (401)",description:"로그인이 필요한 요청",response:r.authError(),status:"error"}),e.jsx(s,{title:"권한 에러 (403)",description:"접근 권한이 없는 요청",response:r.permissionError(),status:"error"}),e.jsx(s,{title:"찾을 수 없음 (404)",description:"존재하지 않는 리소스 요청",response:r.notFoundError(),status:"error"}),e.jsx(s,{title:"서버 에러 (500)",description:"서버 내부 오류 발생",response:r.error("서버에서 처리 중 오류가 발생했습니다.",500),status:"error"})]}),parameters:{docs:{description:{story:"다양한 HTTP 에러 상태를 시뮬레이션합니다. 각 에러 상황에 대한 적절한 UI 표시를 확인할 수 있습니다."}}}},l={render:()=>{const[t,a]=m.useState(!0);m.useEffect(()=>{const u=setTimeout(()=>{a(!1)},3e3);return()=>clearTimeout(u)},[]);const i=t?r.loading():o.getSingle;return e.jsxs("div",{className:"max-w-md mx-auto",children:[e.jsx(s,{title:"로딩 상태 시뮬레이션",description:"3초 후 데이터가 로드됩니다.",response:i,status:t?"loading":"success"}),!t&&e.jsx("button",{onClick:()=>a(!0),className:"mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors",children:"다시 로딩하기"})]})},parameters:{docs:{description:{story:"API 요청 중 로딩 상태를 시뮬레이션합니다. 스피너 애니메이션과 로딩 메시지를 확인할 수 있습니다."}}}},p={render:()=>e.jsxs("div",{className:"space-y-8",children:[e.jsxs("section",{children:[e.jsx("h2",{className:"text-xl font-bold text-gray-800 mb-4",children:"✅ 성공 응답"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",children:[e.jsx(s,{title:"GET 200",description:"데이터 조회 성공",response:o.getSingle,status:"success"}),e.jsx(s,{title:"POST 201",description:"데이터 생성 성공",response:o.create,status:"success"}),e.jsx(s,{title:"DELETE 204",description:"데이터 삭제 성공",response:o.delete,status:"success"})]})]}),e.jsxs("section",{children:[e.jsx("h2",{className:"text-xl font-bold text-gray-800 mb-4",children:"❌ 에러 응답"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",children:[e.jsx(s,{title:"401 Unauthorized",description:"인증 필요",response:r.authError(),status:"error"}),e.jsx(s,{title:"403 Forbidden",description:"권한 없음",response:r.permissionError(),status:"error"}),e.jsx(s,{title:"404 Not Found",description:"리소스 없음",response:r.notFoundError(),status:"error"})]})]}),e.jsxs("section",{children:[e.jsx("h2",{className:"text-xl font-bold text-gray-800 mb-4",children:"⏳ 로딩 상태"}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:e.jsx(s,{title:"데이터 로딩 중",description:"서버에서 데이터를 가져오는 중",response:r.loading(),status:"loading"})})]})]}),parameters:{docs:{description:{story:"모든 API 응답 상태를 한 번에 비교할 수 있는 종합 갤러리입니다. 성공, 에러, 로딩 상태의 UI 차이를 확인할 수 있습니다."}}}};var x,A,h,b,f;n.parameters={...n.parameters,docs:{...(x=n.parameters)==null?void 0:x.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">\r
      <ApiResponseCard title="포스트 조회 (GET)" description="단일 포스트의 상세 정보를 가져옵니다." response={mockPostApi.getSingle} status="success" />\r
      \r
      <ApiResponseCard title="포스트 목록 (GET)" description="페이지네이션된 포스트 목록을 가져옵니다." response={mockPostApi.getList} status="success" />\r
      \r
      <ApiResponseCard title="포스트 생성 (POST)" description="새로운 포스트를 생성합니다." response={mockPostApi.create} status="success" />\r
      \r
      <ApiResponseCard title="포스트 수정 (PATCH)" description="기존 포스트를 수정합니다." response={mockPostApi.update} status="success" />\r
      \r
      <ApiResponseCard title="포스트 삭제 (DELETE)" description="포스트를 삭제합니다." response={mockPostApi.delete} status="success" />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: '포스트 관련 API의 모든 CRUD 작업을 테스트합니다. 각 응답 형태와 상태 코드를 확인할 수 있습니다.'
      }
    }
  }
}`,...(h=(A=n.parameters)==null?void 0:A.docs)==null?void 0:h.source},description:{story:`## 포스트 API 테스트\r
\r
**기능**: 포스트 CRUD 작업 테스트  \r
**응답**: 생성, 조회, 수정, 삭제 시나리오  \r
**상태**: 200, 201, 204 성공 응답  \r
**특징**: \r
- 단일 포스트 조회 (GET)\r
- 포스트 목록 조회 (GET)\r
- 포스트 생성 (POST)\r
- 포스트 수정 (PATCH)\r
- 포스트 삭제 (DELETE)`,...(f=(b=n.parameters)==null?void 0:b.docs)==null?void 0:f.description}}};var j,S,N,E,T;c.parameters={...c.parameters,docs:{...(j=c.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">\r
      <ApiResponseCard title="로그인 성공" description="올바른 인증 정보로 로그인 성공" response={mockAuthApi.loginSuccess} status="success" />\r
      \r
      <ApiResponseCard title="로그인 실패" description="잘못된 인증 정보로 로그인 실패" response={mockAuthApi.loginFailure} status="error" />\r
      \r
      <ApiResponseCard title="로그아웃" description="안전한 로그아웃 처리" response={mockAuthApi.logoutSuccess} status="success" />\r
      \r
      <ApiResponseCard title="토큰 갱신" description="리프레시 토큰으로 액세스 토큰 갱신" response={mockAuthApi.refreshSuccess} status="success" />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: '인증 관련 API의 성공/실패 시나리오를 테스트합니다. JWT 토큰 관리도 포함됩니다.'
      }
    }
  }
}`,...(N=(S=c.parameters)==null?void 0:S.docs)==null?void 0:N.source},description:{story:`## 인증 API 테스트\r
\r
**기능**: 로그인/로그아웃 관련 테스트  \r
**응답**: 성공, 실패 시나리오  \r
**토큰**: JWT 토큰 관리 테스트  \r
**특징**: \r
- 로그인 성공 (사용자 정보 + 토큰)\r
- 로그인 실패 (401 에러)\r
- 로그아웃 (세션 정리)\r
- 토큰 갱신 (리프레시 토큰)`,...(T=(E=c.parameters)==null?void 0:E.docs)==null?void 0:T.description}}};var v,C,y,I,R;d.parameters={...d.parameters,docs:{...(v=d.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">\r
      <ApiResponseCard title="인증 에러 (401)" description="로그인이 필요한 요청" response={createApiResponse.authError()} status="error" />\r
      \r
      <ApiResponseCard title="권한 에러 (403)" description="접근 권한이 없는 요청" response={createApiResponse.permissionError()} status="error" />\r
      \r
      <ApiResponseCard title="찾을 수 없음 (404)" description="존재하지 않는 리소스 요청" response={createApiResponse.notFoundError()} status="error" />\r
      \r
      <ApiResponseCard title="서버 에러 (500)" description="서버 내부 오류 발생" response={createApiResponse.error("서버에서 처리 중 오류가 발생했습니다.", 500)} status="error" />\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: '다양한 HTTP 에러 상태를 시뮬레이션합니다. 각 에러 상황에 대한 적절한 UI 표시를 확인할 수 있습니다.'
      }
    }
  }
}`,...(y=(C=d.parameters)==null?void 0:C.docs)==null?void 0:y.source},description:{story:`## 에러 상태 테스트\r
\r
**기능**: 다양한 에러 상황 시뮬레이션  \r
**상태**: 401, 403, 404, 500 에러  \r
**핸들링**: 에러 메시지와 UI 표시  \r
**특징**: \r
- 인증 필요 (401 Unauthorized)\r
- 권한 없음 (403 Forbidden)\r
- 찾을 수 없음 (404 Not Found)\r
- 서버 에러 (500 Internal Server Error)`,...(R=(I=d.parameters)==null?void 0:I.docs)==null?void 0:R.description}}};var P,k,w,L,F;l.parameters={...l.parameters,docs:{...(P=l.parameters)==null?void 0:P.docs,source:{originalSource:`{
  render: () => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    }, []);
    const response = isLoading ? createApiResponse.loading() : mockPostApi.getSingle;
    return <div className="max-w-md mx-auto">\r
        <ApiResponseCard title="로딩 상태 시뮬레이션" description="3초 후 데이터가 로드됩니다." response={response} status={isLoading ? "loading" : "success"} />\r
        \r
        {!isLoading && <button onClick={() => setIsLoading(true)} className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">\r
            다시 로딩하기\r
          </button>}\r
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'API 요청 중 로딩 상태를 시뮬레이션합니다. 스피너 애니메이션과 로딩 메시지를 확인할 수 있습니다.'
      }
    }
  }
}`,...(w=(k=l.parameters)==null?void 0:k.docs)==null?void 0:w.source},description:{story:`## 로딩 상태 테스트\r
\r
**기능**: API 요청 중 로딩 상태 표시  \r
**애니메이션**: 스피너와 로딩 메시지  \r
**시뮬레이션**: 실제 네트워크 지연 모방  \r
**특징**: \r
- 스피너 애니메이션\r
- 로딩 메시지 표시\r
- 사용자 경험 개선\r
- 네트워크 지연 시뮬레이션`,...(F=(L=l.parameters)==null?void 0:L.docs)==null?void 0:F.description}}};var U,J,_,O,D;p.parameters={...p.parameters,docs:{...(U=p.parameters)==null?void 0:U.docs,source:{originalSource:`{
  render: () => <div className="space-y-8">\r
      {/* 성공 상태들 */}\r
      <section>\r
        <h2 className="text-xl font-bold text-gray-800 mb-4">✅ 성공 응답</h2>\r
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">\r
          <ApiResponseCard title="GET 200" description="데이터 조회 성공" response={mockPostApi.getSingle} status="success" />\r
          <ApiResponseCard title="POST 201" description="데이터 생성 성공" response={mockPostApi.create} status="success" />\r
          <ApiResponseCard title="DELETE 204" description="데이터 삭제 성공" response={mockPostApi.delete} status="success" />\r
        </div>\r
      </section>\r
\r
      {/* 에러 상태들 */}\r
      <section>\r
        <h2 className="text-xl font-bold text-gray-800 mb-4">❌ 에러 응답</h2>\r
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">\r
          <ApiResponseCard title="401 Unauthorized" description="인증 필요" response={createApiResponse.authError()} status="error" />\r
          <ApiResponseCard title="403 Forbidden" description="권한 없음" response={createApiResponse.permissionError()} status="error" />\r
          <ApiResponseCard title="404 Not Found" description="리소스 없음" response={createApiResponse.notFoundError()} status="error" />\r
        </div>\r
      </section>\r
\r
      {/* 로딩 상태 */}\r
      <section>\r
        <h2 className="text-xl font-bold text-gray-800 mb-4">⏳ 로딩 상태</h2>\r
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">\r
          <ApiResponseCard title="데이터 로딩 중" description="서버에서 데이터를 가져오는 중" response={createApiResponse.loading()} status="loading" />\r
        </div>\r
      </section>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: '모든 API 응답 상태를 한 번에 비교할 수 있는 종합 갤러리입니다. 성공, 에러, 로딩 상태의 UI 차이를 확인할 수 있습니다.'
      }
    }
  }
}`,...(_=(J=p.parameters)==null?void 0:J.docs)==null?void 0:_.source},description:{story:`## 전체 API 상태 비교\r
\r
모든 API 응답 상태를 한 번에 비교해볼 수 있는 갤러리 뷰입니다.\r
성공, 에러, 로딩 상태의 UI 차이를 직관적으로 확인할 수 있습니다.`,...(D=(O=p.parameters)==null?void 0:O.docs)==null?void 0:D.description}}};const Z=["PostApiTests","AuthApiTests","ErrorStateTests","LoadingStateTest","AllApiStates"];export{p as AllApiStates,c as AuthApiTests,d as ErrorStateTests,l as LoadingStateTest,n as PostApiTests,Z as __namedExportsOrder,X as default};
