/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var query = '';

var SearchButton = React.createClass({
  render: function() {
    return (
      <a {...this.props}
        href="javascript:;"
        role="button"
        className={(this.props.className || '') + ' btn'} />
    );
  }
});

var BootstrapButton = React.createClass({
  render: function() {
    return (
      <a {...this.props}
        href="javascript:;"
        role="button"
        className={(this.props.className || '') + ' btn'} />
    );
  }
});

var CategoryUnit = React.createClass({
  render: function() {
    console.log('CategoryUnit');
    console.log(this.props);
    if ( this.props.checked ) {
      return (
        <div className="categoryUnit checked" onClick={this.getTagsOff}>
          <img width="260" src={this.props.img_url}></img>
        </div>
      );
    } else {
      return (
        <div className="categoryUnit" onClick={this.getTagsOn}>
          <img width="260" src={this.props.img_url}></img>
        </div>
      );
    }
  },
  getTagsOn: function() {
    console.log('getTagsOn start');
    var category = this.props.raw;
    this.props.onClick(category);
  },
  getTagsOff: function() {
    console.log('getTagsOff start');
    var category = this.props.raw;
    this.props.onClick(category);
  }
});

var TagUnit = React.createClass({
  getInitialState: function() {
    return {checkedflg:this.props.checkedflg};
  },
  onclick: function() {
    console.log(this.state.checked);
    if ( this.state.checkedflg ) {
      //console.log('falseに更新します');
      this.setState( {checkedflg:false});
      this.props.handleCheck(this.props.id, true);
    } else {
      //console.log('trueに更新します');
      this.setState( {checkedflg:true});
      this.props.handleCheck(this.props.id, false);
    }
  },
  render: function() {
    if ( this.state.checkedflg ) {
      return (
        <div className="tagUnit">
          <a className="tag-on">
            <span onClick={this.onclick}>{this.props.tagName}</span>
          </a>
        </div>
      );
    } else {
      return (
        <div className="tagUnit">
          <a className="tag-off">
            <span onClick={this.onclick}>{this.props.tagName}</span>
          </a>
        </div>
      );
    }
  }
});

var TagArea = React.createClass({
  getInitialState: function() {
    return {tags:[],checkedtags:this.props.tags};
  },
  updateTags: function(data) {
    if ( data == null ) {
      this.setState( {tags:'nopage'});
    } else {
      this.setState( {tags:data.result} );
    }
  },
  handleCheck: function(tag_id, flg) {
    this.props.updateCurrentTags(tag_id, flg);
  },
  render: function() {
    //console.log('TagArea');
    //console.log(this.state.tags);
    //console.log(this.state.checkedtags);
    var tagNodes;
    var handleCheck = this.handleCheck;
    if (this.state.tags === [] || this.state.tags === 'nopage') {
      tagNodes = null;
    } else {
      var checkedtags = this.state.checkedtags;
      tagNodes = this.state.tags.map(function(tag) {
        var checkedflg = false;
        for (key in checkedtags) {
          if ( tag.term_id == key ) {
            checkedflg = true;
            break;
          }
        }
        return (
          <TagUnit key={tag.term_id} id={tag.term_id} tagName={tag.name} handleCheck={handleCheck} checkflg={checkedflg}/>
        );
      });
    }
    return (
      <div className="tagArea">
        {tagNodes}
      </div>
    );
  }
});

var CategoryArea = React.createClass({
  getInitialState: function() {
    return {categories:[
      {title:'Protools', category:[71,76], img_url:'http://sleepfreaks-dtm.com/wordpress/wp-content/themes/dsanctuary/images/protools.png', checked:false},
      {title:'Logic', category:[74,73], img_url:'http://sleepfreaks-dtm.com/wordpress/wp-content/themes/dsanctuary/images/logic.png', checked:false},
      ]};
  },
  onClick: function(category_var){
    console.log('category_var')
    console.log(category_var);
    var new_categories = [];
    var new_category = '';
    this.state.categories.forEach(function(category){
      console.log(category);
      console.log(category.title);
      console.log(category_var.title);
      console.log(category.checked);
      if ( category_var.title == category.title && category.checked == false ) {
        console.log(category.title + ' on');
        new_categories.push({title:category.title, category:category.category, img_url:category.img_url, checked:true});
      } else {
        console.log(category.title + ' off');
        new_categories.push({title:category.title, category:category.category, img_url:category.img_url, checked:false});
      }
    });
    //if(category.checked){
    //  category.checked = false;
    //} else {
    //  category.checked = true;
    //}
    this.setState( {categories:new_categories} );
    this.props.resetChecked();
    console.log('new_categories');
    console.log(new_categories);
    console.log('this.state.categories');
    console.log(this.state.categories);
    //this.getTags();
  },
  getTags: function(){
    query = '';
    console.log('getTags');
    console.log(this.state.categories);
    this.state.categories.forEach(function(category){
      if ( category.checked ) {
        if ( query.length > 0 ) {
          query += ',';
        }
        query += category.category;
      }
    });
    if ( query.length == 0 ) {
      //this.updateTags('nopage');
    }
    $.ajax({
      url: 'http://sleepfreaks-dtm.com:81/tag/' + query,
      dataType: 'json',
      type: 'GET',
      //data: comment,
      success: function(data) {
        //this.setState({data: data});
        //console.log(data);
        this.updateTags(data);
        console.log('data');
        console.log(data);
      }.bind(this),
      error: function(xhr, status, err) {
        //this.setState({data: comments});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  updateTags: function(data) {
    this.props.updateTags(data);
  },
  render: function() {
    console.log('CategoryArea');
    console.log(this.state);
    this.getTags();
    //this.props.resetChecked();
    var onClickFunction = this.onClick;
    var categoryNodes = this.state.categories.map(function(category) {
      return (
        <CategoryUnit key={category.title} title={category.title} category={category.category} checked={category.checked} raw={category} onClick={onClickFunction} img_url={category.img_url}/>
      );
    });
    return (
      <div className="categoryArea">
        {categoryNodes}
      </div>
    );
  },
});

var PostUnit = React.createClass({
  render: function() {
    return (
      <div className="postUnit">
        <span></span>
        <img src={this.props.img_url}></img>
        <a href={this.props.permelink}>{this.props.title}</a>
      </div>
    );
  }
});

var PostArea = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function() {
    console.log(this.state.posts);
    var postNodes = this.props.posts.map(function(post) {
      return (
        <PostUnit key={post.ID} id={post.ID} img_url={post.guid} permelink={post.link} title={post.post_title}/>
      );
    });
    return (
      <div className="postArea">
        {postNodes}
      </div>
    );
  }
});

var BootstrapModal = React.createClass({
  getInitialState: function() {
    return { tags:[], posts:[] };
  },
  // The following two methods are the only places we need to
  // integrate Bootstrap or jQuery with the components lifecycle methods.
  componentDidMount: function() {
    // When the component is added, turn it into a modal
    $(this.refs.root).modal({backdrop: 'static', keyboard: false, show: false});

    // Bootstrap's modal class exposes a few events for hooking into modal
    // functionality. Lets hook into one of them:
    $(this.refs.root).on('hidden.bs.modal', this.handleHidden);
  },
  componentWillUnmount: function() {
    $(this.refs.root).off('hidden.bs.modal', this.handleHidden);
  },
  close: function() {
    $(this.refs.root).modal('hide');
  },
  open: function() {
    console.log('modal show');
    $(this.refs.root).modal('show');
  },
  updateTags: function(data) {
    this.refs.tagArea.updateTags(data);
  },
  updateCurrentTags: function(tag_id, flg) {
    console.log(tag_id);
    console.log(flg);
    var new_checkedtags = {};
    if ( flg ) {
      new_checkedtags = this.state.tags;
      delete new_checkedtags[tag_id];
    } else {
      new_checkedtags = this.state.tags;
      new_checkedtags[tag_id] = true;
    }
    this.setState( {tags:new_checkedtags} );
  },
  resetChecked: function() {
    this.setState( {tags:[] });
  },
  getPosts: function() {
    //
    if (this.state.tags == []) {
      return;
    }
    console.log('get posts');
    var tag_query = '';
    var currentTags = this.state.tags;
    for ( var key in currentTags ) {
      if ( tag_query.length > 0 ) {
        tag_query += ',';
      }
      tag_query += key;
    }
    console.log(tag_query);
    console.log(query);
    if ( query.length == 0) {
      return;
    }
    $.ajax({
      url: 'http://sleepfreaks-dtm.com:81/post/' + query + '/' + tag_query,
      dataType: 'json',
      type: 'GET',
      //data: comment,
      success: function(data) {
        console.log('data');
        console.log(data);
        this.setState( {posts:data.result} );
      }.bind(this),
      error: function(xhr, status, err) {
        //this.setState({data: comments});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    this.getPosts();
    var confirmButton = null;
    var cancelButton = null;
    console.log('modal tags');
    console.log( this.state.tags );
    if (this.props.confirm) {
      confirmButton = (
        <BootstrapButton
          onClick={this.handleConfirm}
          className="btn-primary">
          {this.props.confirm}
        </BootstrapButton>
      );
    }
    if (this.props.cancel) {
      cancelButton = (
        <BootstrapButton onClick={this.handleCancel} className="btn-default">
          {this.props.cancel}
        </BootstrapButton>
      );
    }

    return (
      <div className="modal fade" ref="root">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                onClick={this.handleCancel}>
                &times;
              </button>
              <h3>{this.props.title}</h3>
            </div>
            <div className="modal-body">
              <CategoryArea ref="categoryArea" onClick={this.changeCheck} updateTags={this.updateTags} resetChecked={this.resetChecked} />
              <TagArea ref="tagArea" updateCurrentTags={this.updateCurrentTags} tags={this.state.tags}/>
              <PostArea ref="postArea" posts={this.state.posts} />
            </div>
            <div className="modal-footer">
              {cancelButton}
              {confirmButton}
            </div>
          </div>
        </div>
      </div>
    );
  },
  handleCancel: function() {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  },
  handleConfirm: function() {
    if (this.props.onConfirm) {
      this.props.onConfirm();
    }
  },
  handleHidden: function() {
    if (this.props.onHidden) {
      this.props.onHidden();
    }
  }
});

var SearchComponent = React.createClass({
  render: function() {
    var modal = null;
    modal = (
      <BootstrapModal
        ref="modal"
        confirm="OK"
        cancel="Cancel"
        title="検索フォーム">
      </BootstrapModal>
    );
    return (
      <div className="searchComponent">
        {modal}
        <SearchButton onClick={this.openModal} className="btn-default">
          Open modal
        </SearchButton>
      </div>
    );
  },
  openModal: function() {
    this.refs.modal.open();
    console.log('open modal');
  },
});

ReactDOM.render(
  <SearchComponent />,
  document.getElementById('content')
);
