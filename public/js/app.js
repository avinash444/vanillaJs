window.addEventListener('load', () => {
  var el = document.getElementById('app')

  Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
  });
  var tableTemplate = document.getElementById('table-layout-template')
  const tableLayout = Handlebars.compile((tableTemplate).innerHTML)
  var data = null
  var totalSize = 0;
  var pageNeighbours = 1;
  var currentPage = 0;
  //var pages = []
  const api = axios.create({
    baseURL:'https://restcountries.eu/rest/v2',
    timeout:5000
  })
  const fetchList = async (url) => {
    var html = tableLayout()
    el.innerHTML = html
    try {
      const response = await api.get(url)
      const { data } = response
      //var dataSlice = data.slice(0,20)
      totalSize = Math.round(data.length/5)

      var newData = splitData(data, 5);
      var pages = fetchPageNumbers();

      html = tableLayout({data:newData[currentPage], pages})
      el.innerHTML = html

      // const { area, name, captial,population, region } = data
      // console.log(area, name, captial,population, region );
    } catch {
      throw new Error('unable to fetch data')
    }
  }
 fetchList('/all')

 function splitData(size, chunk) {
   var newArray = []
   for(var i=0; i<size.length; i += chunk)  {
     newArray.push(size.slice(i,i + chunk))
   }
   return newArray
 }

 function range(from,to,step=1) {
     let i = from
     let range = []
     while(i<= to) {
       range.push(i)
       i += step
     }

     return range;
   }

 function fetchPageNumbers() {
    let totalNumbers = (pageNeighbours * 2) + 3
    let totalBlocks = totalNumbers + 2;
    if(totalSize > totalBlocks) {
      let beforeLastPage = totalSize - 1
      let startPage = Math.max(1,currentPage - pageNeighbours)
      let endPage = Math.min(totalSize - 1, currentPage + pageNeighbours)
      let pages = range(startPage,endPage)

      let leftSpill = startPage > 1;
      let rightSpill = endPage < beforeLastPage
      let offSet = totalNumbers - pages.length - 1

      switch (true) {
        case (leftSpill && !rightSpill): {
          let extraPages = range(startPage - offSet, startPage - 1)
          pages = ['LEFT_PAGE',...extraPages,...pages]
          break;
        }

        case (rightSpill && !leftSpill):{
          let extraPages = range(endPage + 1, endPage + offSet)
          pages = [...pages,...extraPages,'RIGHT_PAGE']
          break;
        }

        case (rightSpill && leftSpill):

        default: {
          pages = ['LEFT_PAGE',...pages,'RIGHT_PAGE']
        }

      }
      return [0,...pages,totalSize]
    }

    return range(0,totalSize)
  }
  // function filterByValue(e) {
  //   var element = e.target.name
  //
  // }
  document.getElementById('area').addEventListener('change',function(e) {
    console.log(e);
  })
  // document.getElementById('nameCity').addEventListener('change', filterByValue)
  // document.getElementById('capital').addEventListener('change', filterByValue)
  // document.getElementById('population').addEventListener('change', filterByValue)
  // document.getElementById('region').addEventListener('change', filterByValue)

  var classPrevPage = document.getElementsByClassName('prevPage')
  var classNextPage = document.getElementsByClassName('nextPage')
  var numberPage = document.getElementsByClassName('numberPage')

})
