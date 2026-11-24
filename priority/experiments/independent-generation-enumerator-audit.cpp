#include <array>
#include <algorithm>
#include <cstdint>
#include <iostream>
#include <vector>
#include <stdexcept>
using namespace std;
constexpr int n=20; using Mask=uint32_t; using Table=array<array<int,n>,n>; constexpr Mask ALL=(1u<<n)-1;
void require(bool b,const char*m){if(!b)throw runtime_error(m);}
struct El{char t;int i,c,d;};
vector<El> es;
int findel(char t,int i,int c=0,int d=0){for(int k=0;k<n;k++){auto x=es[k];if(x.t==t&&x.i==i&&x.c==c&&x.d==d)return k;}throw runtime_error("lookup");}
Table build(int w0,int w1){
 int W[2]={w0,w1};int us[]={1,2,2,1},vs[]={1,2,1,2};Table T{};for(int i=0;i<n;i++)for(int j=0;j<n;j++){
 auto x=es[i],y=es[j];int z=n-1,k=z;
 if(x.t=='z'||y.t=='z')k=z;
 else if(x.t=='G'&&y.t=='G')k=(i+j)%4;
 else if(x.t=='G'){if(y.t=='A')k=findel('A',y.i,(y.c+i)%2);else if(y.t=='T')k=findel('T',y.i,(y.c+i)%us[y.i],y.d);else k=j;}
 else if(y.t=='G'){if(x.t=='B')k=findel('B',x.i,0,(x.d+j)%2);else if(x.t=='T')k=findel('T',x.i,x.c,(x.d+j)%vs[x.i]);else k=i;}
 else if(x.t=='A'&&y.t=='A')k=findel('A',0,x.c);
 else if(x.t=='B'&&y.t=='B')k=findel('B',x.i,0,y.d);
 else if(x.t=='A'&&y.t=='B'){int l=W[y.i];if(l>=0)k=findel('T',l,x.c%us[l],y.d%vs[l]);}
 else if(x.t=='A'&&y.t=='T')k=findel('T',y.i,x.c%us[y.i],y.d);
 else if(x.t=='T'&&y.t=='B')k=findel('T',x.i,x.c,y.d%vs[x.i]);T[i][j]=k;
 }return T;
}
struct Meta{array<Mask,n> L{},R{},J{};Mask reg=0,idem=0;};
Meta metadata(const Table&T){Meta m;for(int i=0;i<n;i++){for(int j=0;j<n;j++){m.R[i]|=1u<<T[i][j];m.L[i]|=1u<<T[j][i];if(T[T[i][j]][i]==i)m.reg|=1u<<i;for(int k=0;k<n;k++)m.J[i]|=1u<<T[T[j][i]][k];}if(T[i][i]==i)m.idem|=1u<<i;}return m;}
Mask closure_add(const Table&T,Mask C,int x){Mask queue=(1u<<x)&~C;while(queue){int a=__builtin_ctz(queue);queue&=queue-1;if(C&(1u<<a))continue;C|=1u<<a;Mask M=C;while(M){int b=__builtin_ctz(M);M&=M-1;queue|=((1u<<T[a][b])|(1u<<T[b][a]))&~C;}}return C;}
int main(){for(int i=0;i<4;i++)es.push_back({'G',i,0,0});for(int c=0;c<2;c++)es.push_back({'A',0,c,0});for(int j=0;j<2;j++)for(int d=0;d<2;d++)es.push_back({'B',j,0,d});int us[]={1,2,2,1},vs[]={1,2,1,2};for(int i=0;i<4;i++)for(int c=0;c<us[i];c++)for(int d=0;d<vs[i];d++)es.push_back({'T',i,c,d});es.push_back({'z',0,0,0});require(es.size()==n,"carrier");
 Table baseline=build(-1,-1);Meta m0=metadata(baseline);vector<Mask> closure(1u<<n);array<uint64_t,n+1> commonH{};int num=0;uint64_t subsets=0,triples=0;for(auto w:vector<array<int,2>>{{-1,-1},{0,1},{1,0},{2,3},{3,2}}){Table T=build(w[0],w[1]);Meta m=metadata(T);require(m.L==m0.L&&m.R==m0.R&&m.J==m0.J&&m.reg==m0.reg&&m.idem==m0.idem,"metadata");for(int x=0;x<n;x++)for(int y=0;y<n;y++){require(T[0][x]==x&&T[x][0]==x,"identity");bool fixed=(x<4||y<4||x>=10||y>=10||baseline[x][y]<10);for(auto J:m.J)if(J!=ALL&&(J&(1u<<x))&&(J&(1u<<y)))fixed=true;if(fixed)require(T[x][y]==baseline[x][y],"supplied product");else require(T[x][y]>=10,"quotient");for(int z=0;z<n;z++){require(T[T[x][y]][z]==T[x][T[y][z]],"associativity");triples++;}}
 closure[0]=0;array<uint64_t,n+1> g{},h{};for(Mask a=1;a<=ALL;a++){int x=__builtin_ctz(a);closure[a]=closure_add(T,closure[a&(a-1)],x);subsets++;if(closure[a]==ALL)g[__builtin_popcount(a)]++;}for(Mask a=1;a<=ALL;a++)if(closure[a]==ALL){bool min=true;for(Mask b=a;b;b&=b-1){if(closure[a^(b&-b)]==ALL){min=false;break;}}if(min)h[__builtin_popcount(a)]++;}
 Mask E=0;for(int t=0;t<n;t++){bool witness=false;for(int x=0;x<n;x++)for(int y=0;y<n;y++)if(x!=t&&y!=t&&T[x][y]==t)witness=true;if(!witness)E|=1u<<t;require(bool(E&(1u<<t))==(closure[ALL^(1u<<t)]!=ALL),"E equivalence");}int r=0;while(!g[r])r++;if(num){require(r==6&&g[6]==64&&h[6]==64,"rank/count");for(int j=0;j<=n;j++)if(j!=6)require(h[j]==0,"minimal degree");require((E==0)==(num<=2),"verdict");if(num==1)commonH=h;else require(commonH==h,"full H");}
 cout<<"W="<<w[0]<<","<<w[1]<<" rank="<<r<<" g_r="<<g[r]<<" E="<<__builtin_popcount(E)<<" h=";for(int j=0;j<=n;j++)if(h[j])cout<<j<<":"<<h[j]<<" ";cout<<"\n";num++;}
 cout<<"PASS tables="<<num<<" subsets="<<subsets<<" triples="<<triples<<"\n";
}
