import React from "react";
import {Stack, Divider} from "@mui/material";
import {Proposal} from "../Types";
import ContentRow from "./ContentRow";

type ProposalContentProps = {
  proposal: Proposal;
};

export function ProposalContent({proposal}: ProposalContentProps) {
  return (
    <Stack
      direction="column"
      spacing={4}
      divider={
        <Divider variant="dotted" orientation="horizontal" sx={{mb: 0}} />
      }
    >
      <ContentRow title="Proposal Hash" text={proposal.execution_hash} />
      <ContentRow
        title="Proposal Script"
        text={proposal.metadata.execution_script}
      />
      <ContentRow title="Description" text={proposal.metadata.description} />
    </Stack>
  );
}
