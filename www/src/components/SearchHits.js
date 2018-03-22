import React from 'react';
import {
  connectStateResults,
  // connectAutoComplete
  connectHits
} from 'react-instantsearch/connectors';
import { Index } from 'react-instantsearch/dom';
import isEmpty from 'lodash/isEmpty';

import { makeResult } from './Result';
import EmptySearch from './EmptySearch';
import NoResults from './NoResults';

import './hits.css';

const attributes = {
  challenges: ['title', 'description'],
  guides: ['title', 'content'],
  youtube: ['title', 'description']
};

const ChallengeHit = makeResult(...attributes.challenges);
ChallengeHit.displayName = 'ChallengeHit';

const GuidesHit = makeResult(...attributes.guides);
GuidesHit.displayName = 'GuidesHit';

const YoutubeHit = makeResult(...attributes.youtube);
YoutubeHit.displayName = 'YoutubeHit';

// const hitCompMap = {
//   challenges: ChallengeHit,
//   guides: GuidesHit,
//   youtube: YoutubeHit
// };

// const blockTitleMap = {
//   challenges: 'Lessons',
//   guides: 'Guide',
//   youtube: 'YouTube'
// };

const indices = [
  { name: 'challenges', hitComponent: ChallengeHit, title: 'Lessons' },
  { name: 'guides', hitComponent: GuidesHit, title: 'Guide' },
  { name: 'youtube', hitComponent: YoutubeHit, title: 'Youtube' }
];

// const AllHits = connectAutoComplete(
//   ({ hits, handleSubmit }) =>
//     hits.length ? (
//       <div className="ais-Hits">
//         {hits.map(({ hits: results, index }) => {
//           const HitComponent = hitCompMap[index];
//           return (
//             <div className="hits-block-wrapper" key={index}>
//               <div className="hits-block-title">
//                 <h4>{blockTitleMap[index]}</h4>
//               </div>
//               <ul className="ais-Hits-list">
//                 {results.map(result => (
//                   <li
//                     className="ais-Hits-item"
//                     data-fccobjectid={result.objectID}
//                     key={result.objectID}
//                   >
//                     <HitComponent handleSubmit={handleSubmit} hit={result} />
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           );
//         })}
//       </div>
//     ) : null
// );

const CustomHits = connectHits(
  ({ hits, title, handleSubmit, hitComponent: HitComponent }) => (
    <div className="hits-block-wrapper">
      <div className="hits-block-title">
        <h4>{title}</h4>
      </div>
      <ul className="ais-Hits-list">
        {hits.map(hit => (
          <li
            className="ais-Hits-item"
            data-fccobjectid={hit.objectID}
            key={hit.objectID}
          >
            <HitComponent handleSubmit={handleSubmit} hit={hit} />
          </li>
        ))}
      </ul>
    </div>
  )
);

const AllHits = ({ handleSubmit }) => (
  <div className="ais-Hits">
    {indices.map(({ name, ...props }) => (
      <Index key={name} indexName={name}>
        <CustomHits {...props} handleSubmit={handleSubmit} />
      </Index>
    ))}
  </div>
);

AllHits.displayName = 'AllHits';

const SearchHits = connectStateResults(
  ({ handleSubmit, searchResults, searchState }) => {
    const isSearchEmpty = isEmpty(searchState) || !searchState.query;
    const results = searchResults && searchResults.nbHits !== 0;

    return isSearchEmpty ? (
      <EmptySearch />
    ) : results ? (
      <AllHits handleSubmit={handleSubmit} />
    ) : (
      <NoResults query={searchState.query} />
    );
  }
);

SearchHits.displayName = 'SearchHits';

export default SearchHits;
